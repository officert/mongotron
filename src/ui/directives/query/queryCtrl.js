'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$timeout',
  '$rootScope',
  'alertService',
  'modalService',
  '$window',
  '$log',
  function($scope, $timeout, $rootScope, alertService, modalService, $window, $log) {
    const queryModule = require('lib/modules/query');

    if (!$scope.collection) throw new Error('collection is required for collection query directive');

    $scope.loading = false;
    $scope.queryTime = null;
    $scope.editorHandle = {};

    $scope.codeEditorOptions = {};

    $scope.form = {
      searchQuery: 'db.' + $scope.collection.name.toLowerCase() + '.find({\n  \n})',
      skip: 0,
      limit: 50
    };

    $scope.VIEWS = {
      RAW: 'LIST',
      KEYVALUE: 'KEYVALUE'
    };
    $scope.currentView = $scope.VIEWS.LIST;

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

    $scope.autoformat = function() {
      if ($scope.editorHandle.autoformat) {
        $scope.editorHandle.autoformat();
      }
    };

    $scope.editorHasFocus = false;

    $scope.$watch('editorHasFocus', function(val) {
      if (val) {
        //make some functions available on the root scope when the editor gets focus,
        //used for keybindings
        $rootScope.currentQuery = {
          runQuery: $scope.runQuery,
          autoformat: $scope.autoformat
        };
      } else {
        $rootScope.currentQuery = null;
      }
    });

    $scope.exportResults = function() {
      modalService.openQueryResultsExport($scope.collection, $scope.exportQuery);
    };

    $scope.runQuery = function runQuery() {
      $scope.loading = true;
      $scope.error = null;

      var rawQuery = $scope.form.searchQuery;

      $scope.exportQuery = rawQuery; //used by the query-results-export directive

      if (!queryModule.isValidQuery(rawQuery)) {
        $scope.error = 'Sorry, that is not a valid mongo query type';
        $scope.loading = false;
        return;
      }

      var collectionName = queryModule.getCollectionNameByQuery(rawQuery);

      var collection = _getCollectionByName(collectionName);

      if (!collection) {
        $scope.error = 'Sorry, that is not a valid collection name';
        $scope.loading = false;
        return;
      }

      var query = queryModule.createQuery(rawQuery);

      if (!query) {
        $scope.error = 'Sorry, that is not a valid mongo query type';
        $scope.loading = false;
        return;
      }

      collection.execQuery(query)
        .then((results) => {
          $scope.results = results;
        })
        .catch((error) => {
          $log.error(error);
          $scope.error = error;
          $scope.loading = false;
          return;
        });

      // if (!queryFn) {
      //   $scope.error = 'Sorry, that is not a valid mongo query type';
      //   $scope.loading = false;
      //   return;
      // }

      // var result = convertSearchQueryToJsObject($scope.form.searchQuery);
      //
      // if ((!result || !result.query) || _.isError(result)) {
      //   $scope.error = result && result.message ? result.message : 'Sorry, that is not a valid mongo query';
      //   $scope.loading = false;
      //   return;
      // }
      //
      // $scope.exportQuery = result.query;
      //
      // logger.debug('running query', result.query, result.options);
      //
      // _runQuery(queryFn, result.query, result.options);
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

              return _runQuery(findQuery);
            }
            if (!results) return;

            $scope.results = results;
          });
        })
        .catch(function(err) {
          $timeout(function() {
            $scope.loading = false;
            $scope.error = err;
          });
        });
    }

    function _getCollectionByName(name) {
      if (!name) throw new Error('name is required');

      return _.find($scope.collection.database.collections, function(collection) {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === name.toLowerCase() ? true : false;
      });
    }

    // function convertSearchQueryToJsObject(query) {
    //   var match;
    //
    //   if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, FIND_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.FIND, match);
    //   } else if (matchesRegex(query, UPDATE_MANY_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, UPDATE_MANY_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.UPDATE_MANY, match);
    //   } else if (matchesRegex(query, UPDATE_ONE_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, UPDATE_ONE_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.UPDATE_ONE, match);
    //   } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, DELETE_MANY_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.DELETE_MANY, match);
    //   } else if (matchesRegex(query, DELETE_ONE_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, DELETE_ONE_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.DELETE_ONE, match);
    //   } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, AGGREGATE_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.AGGREGATE, match);
    //   } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
    //     match = getRegexMatch(query, INSERT_ONE_QUERY_FULL_REGEX);
    //     return evalQueryValueByType(QUERY_TYPES.INSERT_ONE, match);
    //   } else {
    //     return new Error('Sorry, that is not a valid mongo query');
    //   }
    // }

    // function evalQueryValueByType(type, value) {
    //   var queryValue;
    //
    //   switch (type) {
    //     case QUERY_TYPES.UPDATE_MANY:
    //     case QUERY_TYPES.UPDATE_ONE:
    //       var matches = value.match(QUERY_WITH_OPTIONS_REGEX);
    //       if (matches && matches.length > 2) {
    //         var query = evalQueryValue(matches[1]);
    //         var options = evalQueryValue(matches[2]);
    //
    //         if (_.isError(query)) {
    //           queryValue = query;
    //         } else if (_.isError(value)) {
    //           queryValue = value;
    //         } else {
    //           queryValue = {
    //             query: query,
    //             options: options
    //           };
    //         }
    //       } else {
    //         queryValue = new Error('Error parsing query');
    //       }
    //       break;
    //     default:
    //       // case QUERY_TYPES.FIND:
    //       // case QUERY_TYPES.INSERT_ONE:
    //       // case QUERY_TYPES.AGGREGATE:
    //       // case QUERY_TYPES.DELETE_ONE:
    //       // case QUERY_TYPES.DELETE_MANY:
    //       value = evalQueryValue(value);
    //
    //       if (_.isError(value)) {
    //         queryValue = value;
    //       } else {
    //         queryValue = {
    //           query: value
    //         };
    //       }
    //       break;
    //   }
    //
    //   return queryValue;
    // }

    // /**
    //  * @method evalQueryValue - evaluates a JS expression from the Mongotron code editor
    //  * @private
    //  *
    //  * @param {String} raw value from editor
    //  */
    // function evalQueryValue(rawValue) {
    //   var context = {
    //     ObjectId: ObjectId
    //   };
    //   context = _.extend($window, context);
    //
    //   var queryValue;
    //
    //   try {
    //     queryValue = eval.call(context, '(' + rawValue + ')'); // jshint ignore:line
    //   } catch (err) {
    //     queryValue = err;
    //   }
    //
    //   return queryValue;
    // }

    // function getQueryTypeFn(query) {
    //   if (matchesRegex(query, FIND_QUERY_FULL_REGEX)) {
    //     return findQuery;
    //   } else if (matchesRegex(query, UPDATE_MANY_QUERY_FULL_REGEX)) {
    //     return updateManyQuery;
    //   } else if (matchesRegex(query, UPDATE_ONE_QUERY_FULL_REGEX)) {
    //     return updateOneQuery;
    //   } else if (matchesRegex(query, DELETE_MANY_QUERY_FULL_REGEX)) {
    //     return deleteManyQuery;
    //   } else if (matchesRegex(query, DELETE_ONE_QUERY_FULL_REGEX)) {
    //     return deleteOneQuery;
    //   } else if (matchesRegex(query, AGGREGATE_QUERY_FULL_REGEX)) {
    //     return aggregateQuery;
    //   } else if (matchesRegex(query, INSERT_ONE_QUERY_FULL_REGEX)) {
    //     return insertOneQuery;
    //   } else {
    //     return null;
    //   }
    // }

    // function matchesRegex(query, regex) {
    //   var match = query.match(regex);
    //   return match && match.length ? true : false;
    // }
    //
    // function getRegexMatch(query, regex) {
    //   var matches = query.match(regex);
    //   return matches && matches.length > 1 ? matches[1] : null;
    // }

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
  }
]);
