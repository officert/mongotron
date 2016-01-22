'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'notificationService',
  'modalService',
  'queryRunnerService',
  '$timeout', ($scope, $rootScope, notificationService, modalService, queryRunnerService, $timeout) => {
    if (!$scope.database) throw new Error('database is required for database query directive');
    if (!$scope.database.collections || !$scope.database.collections.length) throw new Error('database must have collections for database query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    //editor
    $scope.editorHandle = {};
    $scope.codeEditorOptions = {};
    $scope.codeEditorCustomData = {
      collectionNames: _.pluck($scope.database.collections, 'name')
    };
    $scope.editorHasFocus = false;

    $scope.currentQuery = null;
    $scope.results = [];
    $scope.keyValueResults = [];

    $scope.deleteDocument = _deleteDocument;
    $scope.editDocument = _editDocument;

    let defaultCollection = $scope.defaultCollection ? _.findWhere($scope.database.collections, {
      name: $scope.defaultCollection
    }) : null;

    defaultCollection = defaultCollection || $scope.database.collections[0];

    let defaultQuery = 'db.' + defaultCollection.name.toLowerCase() + '.find({\n  \n})';

    $scope.changeTabName = (name) => {
      if (!name || !$scope.databaseTab) return;
      $scope.databaseTab.name = name.length > 20 ? (name.substring(0, 20) + '...') : name;
    };

    $scope.changeTabName(defaultQuery);

    $scope.form = {
      query: defaultQuery
    };

    $scope.runQuery = () => {
      _runQuery($scope.form.query);
    };

    $scope.VIEWS = {
      TEXT: 'TEXT',
      KEYVALUE: 'KEYVALUE',
      RAW: 'RAW'
    };
    $scope.currentView = $scope.VIEWS.KEYVALUE;

    _runQuery(defaultQuery);

    $scope.autoformat = () => {
      if ($scope.editorHandle.autoformat) {
        $scope.editorHandle.autoformat();
      }
    };

    $scope.$watch('editorHasFocus', (val) => {
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

    $scope.exportResults = () => {
      modalService.openQueryResultsExport($scope.currentCollection, $scope.currentQuery);
    };

    $scope.collapseAll = () => {
      $scope.$broadcast('collapse');
    };

    function _runQuery(rawQuery) {
      $scope.loading = true;
      $scope.error = null;

      $scope.changeTabName(rawQuery);

      queryRunnerService.runQuery(rawQuery, $scope.database.collections)
        .then((results) => {
          $scope.results = results.result;
          $scope.queryTime = results.time;
          $scope.currentQuery = results.query;
          $scope.currentCollection = results.collection;
          $scope.keyValueResults = results.keyValueResults;

          if ($scope.currentQuery.mongoMethod === 'count') {
            $scope.currentView = $scope.VIEWS.RAW;
          } else if ($scope.currentView === $scope.VIEWS.RAW) {
            $scope.currentView = $scope.VIEWS.KEYVALUE;
          }
        })
        .catch((err) => {
          $scope.error = err && err.message ? err.message : err;
        })
        .finally(() => {
          $timeout(() => {
            $scope.loading = false;
          });
        });
    }

    function _deleteDocument(doc) {
      if (!doc) return;

      modalService.openDeleteDocument(doc, $scope.currentCollection)
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

    function _editDocument(doc) {
      if (!doc) return;

      modalService.openEditDocument(doc)
        .then(() => {
          $scope.$apply(() => {
            notificationService.success('Update successful');

            _runQuery('db.' + $scope.currentCollection.name + '.find()');
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            let errMsg = error && error.message ? error.message : error;
            if (errMsg !== 'backdrop click' && errMsg !== 'escape key press') {
              $scope.error = errMsg;
            }
            $scope.loading = false;
          });
        });
    }
  }
]);
