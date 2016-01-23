'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'notificationService',
  'modalService',
  'queryRunnerService', ($scope, $rootScope, notificationService, modalService, queryRunnerService) => {
    const keyValueUtils = require('src/lib/utils/keyValueUtils');

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

    let defaultQuery = `db.${defaultCollection.name}.find({\n  \n})`;

    $scope.changeTabName = (name) => {
      if (!name || !$scope.databaseTab) return;
      $scope.databaseTab.name = name.length > 20 ? `${name.substring(0, 20)}...` : name;
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
        .then(result => {
          $scope.$apply(() => {
            $scope.loading = false;
            $scope.result = result;

            if ($scope.result) {
              if (_.isArray($scope.result)) {
                $scope.keyValueResults = keyValueUtils.convert($scope.result);
              } else {
                $scope.currentView = $scope.VIEWS.RAW;
              }
            }
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.error = error && error.message ? `Error : ${error.message}` : error;
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

            _runQuery(`db.${$scope.currentCollection.name}.find()`);
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

            _runQuery(`db.${$scope.currentCollection.name}.find()`);
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
