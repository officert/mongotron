angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  'alertService',
  'modalService',
  function($scope, $timeout, $rootScope, alertService, modalService) {
    const mongoUtils = require('src/lib/utils/mongoUtils');
    const logger = require('lib/modules/logger');

    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    const QUERY_TYPES = {
      FIND: 'FIND',
      UPDATE_MANY: 'UPDATE_MANY',
      UPDATE_ONE: 'UPDATE_ONE',
      DELETE_MANY: 'DELETE_MANY',
      DELETE_ONE: 'DELETE_ONE',
      AGGREGATE: 'AGGREGATE',
      INSERT_ONE: 'INSERT_ONE'
    };

    //extraction regexes to pull out a valid mongo query object, or array (aggregate)
    const FIND_QUERY_FULL_REGEX = /^(?:find)\(([^]+)\)/;
    const UPDATE_MANY_QUERY_FULL_REGEX = /^(?:updateMany)\(([^]+)\)/;
    const UPDATE_ONE_QUERY_FULL_REGEX = /^(?:updateOne)\(([^]+)\)/;
    const DELETE_MANY_QUERY_FULL_REGEX = /^(?:deleteMany)\(([^]+)\)/;
    const DELETE_ONE_QUERY_FULL_REGEX = /^(?:deleteOne)\(([^]+)\)/;
    const AGGREGATE_QUERY_FULL_REGEX = /^(?:aggregate)\(([^]+)\)/;
    const INSERT_ONE_QUERY_FULL_REGEX = /^(?:insertOne)\(([^]+)\)/;
    //given a string '{...},{...}' this will capture the 2 objects seperately
    //used for any query that requires passing options arg
    const QUERY_WITH_OPTIONS_REGEX = /^({[^]+}),(?:[ \n\r])({[^]+})/;

    const SEARCH_QUERY_DEFAULT = 'find({\n    \n})';

    $scope.codeEditorOptions = {};

    $scope.form = {
      searchQuery: SEARCH_QUERY_DEFAULT,
      skip: 0,
      limit: 50
    };

    $scope.resetSearchQuery = function() {
      $scope.form.searchQuery = SEARCH_QUERY_DEFAULT;
    };

    $scope.VIEWS = {
      RAW: 'RAW',
      KEYVALUE: 'KEYVALUE'
    };
    $scope.currentView = $scope.VIEWS.RAW;

    $scope.getPropertyTypeIcon = function(propertyType) {
      var icon;

      switch (propertyType) {
        case 'number':
          icon = '';
          break;
        case 'string':
          icon = 'fa-quote-left';
          break;
        case 'boolean':
          icon = 'fa-calendar';
          break;
        case 'date':
          icon = 'fa-calendar';
          break;
        case 'array':
          icon = 'fa-calendar';
          break;
        case 'objectId':
          icon = 'fa-cog';
          break;
      }

      return icon;
    };

    $scope.deleteResult = function(result) {
      if (!result) return;

      modalService.confirm({
        message: 'Are you sure you want to delete this record?',
        confirmButtonMessage: 'Yes',
        cancelButtonMessage: 'No'
      }).result.then(function() {
        _runQuery(deleteByIdQuery, result._id);
      });
    };

    $scope.editorHasFocus = false;

    $scope.$watch('editorHasFocus', function(val) {
      if (val) {
        $rootScope.currentQuery = {
          runQuery: $scope.runQuery
        };
      } else {
        $rootScope.currentQuery = null;
      }
    });

    $scope.runQuery = function runQuery() {
      $scope.loading = true;
      $scope.error = null;

      var queryFn = getQueryTypeFn($scope.form.searchQuery);

      if (!queryFn) {
        $scope.error = 'Sorry, that is not a valid mongo query type';
        $scope.loading = false;
        return;
      }

      var searchQueryOptions = convertSearchQueryToJsObject($scope.form.searchQuery);

      if (!searchQueryOptions) {
        $scope.error = $scope.error || 'Sorry, that is not a valid mongo query';
        $scope.loading = false;
        return;
      }

      logger.debug('running query', searchQueryOptions.query, searchQueryOptions.options);

      _runQuery(queryFn, searchQueryOptions.query, searchQueryOptions.options);
    };

    $scope.runQuery();

    function _runQuery(fn, query, queryOptions) {
      var startTime = performance.now();

      query = query || {};

      if (fn === findQuery) {
        queryOptions = {};
        queryOptions.skip = $scope.form.skip;
        queryOptions.limit = $scope.form.limit;
      }

      var promise = fn(query, queryOptions);

      promise.then(function(results) {
          var endTime = performance.now();

          $timeout(function() {
            $scope.queryTime = (endTime - startTime).toFixed(5);

            $scope.loading = false;

            if (fn === insertOneQuery || fn === deleteOneQuery || fn === deleteByIdQuery || fn === deleteManyQuery || fn === updateOneQuery || fn === updateByIdQuery || fn === updateManyQuery) {
              var msg = '';

              if (fn === insertOneQuery) msg += 'Insert ';
              else if (fn === deleteOneQuery || fn === deleteByIdQuery || fn === deleteManyQuery) msg += 'Delete ';
              else if (fn === updateOneQuery || fn === updateByIdQuery || fn === updateManyQuery) msg += 'Update ';

              msg += 'successful...';

              alertService.success(msg);

              // $scope.resetSearchQuery();

              return _runQuery(findQuery);
            }
            if (!results) return;

            $scope.results = results;

            $scope.keyValueResults = results.map(function(result) {
              var props = [];
              props._id = result._id;

              for (var key in result) {
                //TODO: if it's a nested object then recurse and generate key/value for all of it's props
                props.push({
                  _id: result[key] ? result[key]._id : result[key],
                  key: key,
                  value: result[key],
                  type: getPropertyType(result[key])
                });
              }

              return props;
            });
          });
        })
        .catch(function(err) {
          $timeout(function() {
            $scope.loading = false;
            $scope.error = err;
          });
        });
    }

    function convertSearchQueryToJsObject(query) {

      var match;

      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, FIND_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.FIND, match);
      } else if (matchesRegex(query, UPDATE_MANY_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, UPDATE_MANY_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.UPDATE_MANY, match);
      } else if (matchesRegex(query, UPDATE_ONE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, UPDATE_ONE_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.UPDATE_ONE, match);
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, DELETE_MANY_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.DELETE_MANY, match);
      } else if (matchesRegex(query, DELETE_ONE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, DELETE_ONE_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.DELETE_ONE, match);
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, AGGREGATE_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.AGGREGATE, match);
      } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, INSERT_ONE_QUERY_FULL_REGEX);
        return evalQueryValueByType(QUERY_TYPES.INSERT_ONE, match);
      } else {
        return null;
      }
    }

    function evalQueryValueByType(type, value) {
      var queryValue;

      switch (type) {
        case QUERY_TYPES.FIND:
          queryValue = {
            query: evalQueryValue(value)
          };
          break;
        case QUERY_TYPES.UPDATE_MANY:
        case QUERY_TYPES.UPDATE_ONE:
        case QUERY_TYPES.DELETE_ONE:
        case QUERY_TYPES.DELETE_MANY:
          var matches = value.match(QUERY_WITH_OPTIONS_REGEX);
          if (matches && matches.length > 2) {
            queryValue = {
              query: evalQueryValue(matches[1]),
              options: evalQueryValue(matches[2])
            };
          }
          break;
      }

      return queryValue;
    }

    function evalQueryValue(rawValue) {
      var queryValue;
      try {
        // match = $scope.$eval(match);
        queryValue = eval('(' + rawValue + ')'); // jshint ignore:line
      } catch (err) {
        $scope.error = err && err.message ? err.message : err;
        $scope.loading = false;
        queryValue = null;
      }
      return queryValue;
    }

    function getQueryTypeFn(query) {
      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        return findQuery;
      } else if (matchesRegex(query, UPDATE_MANY_QUERY_FULL_REGEX)) {
        return updateManyQuery;
      } else if (matchesRegex(query, UPDATE_ONE_QUERY_FULL_REGEX)) {
        return updateOneQuery;
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        return deleteManyQuery;
      } else if (matchesRegex(query, DELETE_ONE_QUERY_FULL_REGEX)) {
        return deleteOneQuery;
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        return aggregateQuery;
      } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
        return insertOneQuery;
      } else {
        return null;
      }
    }

    function matchesRegex(query, regex) {
      var match = query.match(regex);
      return match && match.length ? true : false;
    }

    function getRegexMatch(query, regex) {
      var matches = query.match(regex);
      return matches && matches.length > 1 ? matches[1] : null;
    }

    function findQuery(query, options) {
      return $scope.collection.find(query, options);
    }

    function updateManyQuery(query, updates) {
      return $scope.collection.updateMany(query, updates);
    }

    function updateOneQuery(query, updates) {
      return $scope.collection.updateOne(query, updates);
    }

    function updateByIdQuery(id, updates) {
      return $scope.collection.updateById(id, updates);
    }

    function deleteManyQuery(query) {
      return $scope.collection.deleteMany(query);
    }

    function deleteOneQuery(query) {
      return $scope.collection.deleteOne(query);
    }

    function deleteByIdQuery(id) {
      return $scope.collection.deleteById(id);
    }

    function aggregateQuery(aggregate) {
      return $scope.collection.aggregate(aggregate);
    }

    function insertOneQuery(doc, options) {
      return $scope.collection.insertOne(doc, options);
    }

    function getPropertyType(property) {
      if (_.isNumber(property)) return 'number';
      if (_.isString(property)) return 'string';
      if (_.isArray(property)) return 'array';
      if (_.isDate(property)) return 'date';
      if (_.isBoolean(property)) return 'boolean';
      if (mongoUtils.isObjectId(property)) return 'objectId';
    }
  }
]);
