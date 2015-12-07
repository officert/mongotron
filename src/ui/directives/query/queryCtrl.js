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

    $scope.runQuery = _runQuery;
    $scope.deleteResult = _deleteResult;

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

    _runQuery();

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

    function _runQuery() {
      $scope.loading = true;
      $scope.error = null;

      var rawQuery = $scope.form.searchQuery;

      $scope.exportQuery = rawQuery; //used by the query-results-export directive

      if (!queryModule.isValidQuery(rawQuery)) {
        $scope.error = 'Sorry, that is not a valid query';
        $scope.loading = false;
        return;
      }

      var collection = _getCollectionFromRawQuery(rawQuery);

      if (!collection) {
        $scope.error = 'Sorry, that is not a valid collection name';
        $scope.loading = false;
        return;
      }

      queryModule.createQuery(rawQuery, {
          evalContext: window
        })
        .then((query) => {
          return collection.execQuery(query);
        })
        .then((results) => {
          $timeout(() => {
            $scope.loading = false;
            $scope.results = results;
          });
        })
        .catch((error) => {
          $timeout(() => {
            $log.error(error);
            $scope.error = error && error.message ? error.message : error;
            $scope.loading = false;
          });
        });
    }

    function _deleteResult(result) {
      if (!result) return;

      modalService.confirm({
        message: 'Are you sure you want to delete this record?',
        confirmButtonMessage: 'Yes',
        cancelButtonMessage: 'No'
      }).result.then(function() {
        //TODO: fix
        // _runQuery(deleteByIdQuery, result._id);
      });
    }

    function _getCollectionFromRawQuery(rawQuery) {
      var collectionName = queryModule.parseCollectionName(rawQuery);

      if (!collectionName) return null;

      return _.find($scope.collection.database.collections, function(collection) {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === collectionName.toLowerCase() ? true : false;
      });
    }
  }
]);
