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

      query.parse(rawQuery, {
          context: window
        })
        .then(collection.execQuery)
        .then((results) => {
          $scope.results = results;
        })
        .catch((error) => {
          $log.error(error);
          $scope.error = error && error.message ? error.message : error;
          $scope.loading = false;
          return;
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

    function _getCollectionByName(name) {
      if (!name) throw new Error('name is required');

      return _.find($scope.collection.database.collections, function(collection) {
        return collection.name && collection.name.toLowerCase && collection.name.toLowerCase() === name.toLowerCase() ? true : false;
      });
    }
  }
]);
