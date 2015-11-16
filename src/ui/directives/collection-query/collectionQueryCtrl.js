angular.module('app').controller('collectionQueryCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  'alertService',
  'modalService',
  function($scope, $timeout, $rootScope, alertService, modalService) {
    const mongoUtils = require('src/lib/utils/mongoUtils');

    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    //extraction regexes to pull out a valid mongo query object, or array (aggregate)
    const FIND_QUERY_FULL_REGEX = /^(?:find)\(([^]+)\)/;
    const UPDATE_QUERY_FULL_REGEX = /^(?:update)\(([^]+)\)/;
    const DELETE_MANY_QUERY_FULL_REGEX = /^(?:deleteMany)\(([^]+)\)/;
    const AGGREGATE_QUERY_FULL_REGEX = /^(?:aggregate)\(([^]+)\)/;
    const INSERT_ONE_QUERY_FULL_REGEX = /^(?:insertOne)\(([^]+)\)/;

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

      var searchQuery = convertSearchQueryToJsObject($scope.form.searchQuery);

      if (!searchQuery) {
        $scope.error = $scope.error || 'Sorry, that is not a valid mongo query';
        $scope.loading = false;
        return;
      }

      console.log('running query', searchQuery);

      _runQuery(queryFn, searchQuery);
    };

    $scope.runQuery();

    function _runQuery(fn, searchQuery) {
      var startTime = performance.now();

      searchQuery = searchQuery || {};

      var searchOptions = {};

      if (fn === findQuery) {
        searchOptions.skip = $scope.form.skip;
        searchOptions.limit = $scope.form.limit;
      }

      var promise = fn(searchQuery, searchOptions);

      promise.then(function(results) {
          var endTime = performance.now();

          $timeout(function() {
            $scope.queryTime = (endTime - startTime).toFixed(5);

            $scope.loading = false;

            if (fn === insertOneQuery || fn === deleteManyQuery || fn === deleteByIdQuery || fn === updateQuery) {
              var msg = '';

              if (fn === insertOneQuery) msg += 'Insert ';
              else if (fn === deleteManyQuery) msg += 'Delete ';
              else if (fn === deleteByIdQuery) msg += 'Delete ';
              else if (fn === updateQuery) msg += 'Update ';

              msg += 'successful...';

              alertService.success(msg);

              $scope.resetSearchQuery();

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
            $scope.error = err;
          });
        });
    }

    function convertSearchQueryToJsObject(query) {

      var match;

      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, FIND_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, UPDATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, UPDATE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, DELETE_MANY_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, AGGREGATE_QUERY_FULL_REGEX);
      } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
        match = getRegexMatch(query, INSERT_ONE_QUERY_FULL_REGEX);
      } else {
        match = null;
      }

      if (!match) return null;

      try {
        // match = $scope.$eval(match);
        match = eval('(' + match + ')');
      } catch (err) {
        $scope.error = err && err.message ? err.message : err;
        $scope.loading = false;
        match = null;
      }
      return match;
    }

    function getQueryTypeFn(query) {
      if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
        return findQuery;
      } else if (matchesRegex(query, UPDATE_QUERY_FULL_REGEX)) {
        return updateQuery;
      } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
        return deleteManyQuery;
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

    function updateQuery(query) {
      return $scope.collection.update(query);
    }

    function deleteManyQuery(query) {
      return $scope.collection.deleteMany(query);
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
