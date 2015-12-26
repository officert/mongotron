'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'notificationService',
  'modalService',
  function($scope, $rootScope, notificationService, modalService) {
    const queryModule = require('lib/modules/query');
    const keyValueUtils = require('src/lib/utils/keyValueUtils');

    if (!$scope.database) throw new Error('database is required for database query directive');
    if (!$scope.database.collections || !$scope.database.collections.length) throw new Error('database must have collections for database query directive');

    $scope.loading = false;
    $scope.queryTime = null;
    $scope.editorHandle = {};
    $scope.codeEditorOptions = {};
    $scope.codeEditorCustomData = {
      collectionNames: _.pluck($scope.database.collections, 'name')
    };

    $scope.currentQuery = null;
    $scope.results = [];
    $scope.keyValueResults = [];

    $scope.deleteResult = _deleteResult;

    let defaultCollection = $scope.defaultCollection ? _.findWhere($scope.database.collections, {
      name: $scope.defaultCollection
    }) : null;

    defaultCollection = defaultCollection || $scope.database.collections[0];

    let defaultQuery = 'db.' + defaultCollection.name.toLowerCase() + '.find({\n  \n})';

    $scope.changeTabName = function(name) {
      if (!name || !$scope.databaseTab) return;
      $scope.databaseTab.name = name.length > 20 ? (name.substring(0, 20) + '...') : name;
    };

    $scope.changeTabName(defaultQuery);

    $scope.form = {
      query: defaultQuery
    };

    $scope.runQuery = function() {
      _runQuery($scope.form.query);
    };

    $scope.VIEWS = {
      TEXT: 'TEXT',
      KEYVALUE: 'KEYVALUE',
      RAW: 'RAW'
    };
    $scope.currentView = $scope.VIEWS.KEYVALUE;

    _runQuery(defaultQuery);

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
      modalService.openQueryResultsExport($scope.currentCollection, $scope.currentQuery);
    };

    $scope.collapseAll = function() {
      $scope.$broadcast('collapse');
    };

    function _runQuery(rawQuery) {
      $scope.loading = true;
      $scope.error = null;

      $scope.changeTabName(rawQuery);

      if (!queryModule.isValidQuery(rawQuery)) {
        $scope.error = 'Sorry, ' + rawQuery + ' is not a valid query';
        $scope.loading = false;
        return;
      }

      let collectionName = queryModule.parseCollectionName(rawQuery);

      let collection = _getCollectionByNameFromRawQuery(collectionName);

      if (!collection) {
        $scope.error = 'Sorry, ' + collectionName + ' is not a valid collection name';
        $scope.loading = false;
        return;
      }

      $scope.currentCollection = collection;

      let query;

      queryModule.createQuery(rawQuery)
        .then((_query) => {
          query = _query;

          return collection.execQuery(query);
        })
        .then((result) => {
          $scope.$apply(() => {
            $scope.currentQuery = query;
            $scope.loading = false;
            $scope.queryTime = result.time;
            $scope.results = result.result;

            if ($scope.results && _.isArray($scope.results)) {
              $scope.keyValueResults = keyValueUtils.convert($scope.results);
            }

            if ($scope.currentQuery.mongoMethod === 'count') {
              $scope.currentView = $scope.VIEWS.RAW;
            } else if ($scope.currentView === $scope.VIEWS.RAW) {
              $scope.currentView = $scope.VIEWS.KEYVALUE;
            }

            if ($scope.currentQuery.mongoMethod !== 'find' &&
              $scope.currentQuery.mongoMethod !== 'aggregate' &&
              $scope.currentQuery.mongoMethod !== 'count') {
              notificationService.success($scope.currentQuery.mongoMethod + ' was successful');

              _runQuery('db.' + $scope.currentCollection.name + '.find()');
            }
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.error = error && error.message ? error.message : error;
            $scope.loading = false;
          });
        });
    }

    function _deleteResult(result) {
      if (!result) return;

      modalService.openDeleteResult(result, $scope.currentCollection)
        .then(() => {
          $scope.$apply(() => {
            notificationService.success('Delete successful');

            _runQuery('db.' + $scope.currentCollection.name + '.find()');
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.error = error && error.message ? error.message : error;
            $scope.loading = false;
          });
        });
    }

    function _getCollectionByNameFromRawQuery(collectionName) {
      if (!collectionName) return null;

      return _.find($scope.database.collections, function(collection) {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === collectionName.toLowerCase() ? true : false;
      });
    }
  }
]);
