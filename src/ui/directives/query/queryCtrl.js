'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'notificationService',
  'modalService', ($scope, $rootScope, notificationService, modalService) => {
    const keyValueUtils = require('src/lib/utils/keyValueUtils');
    const evaluator = require('lib/modules/query/evaluator');

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

      let evalScope = {
        db: {}
      };

      $scope.database.collections.forEach(collection => {
        evalScope.db[collection.name.toLowerCase()] = collection._dbCollection;
      });

      evaluator.eval(rawQuery, evalScope)
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
            $scope.error = error && error.message ? error.message : error;
            $scope.loading = false;
          });
        });

      // if (!queryModule.isValidQuery(rawQuery)) {
      //   $scope.error = 'Sorry, ' + rawQuery + ' is not a valid query';
      //   $scope.loading = false;
      //   return;
      // }
      //
      // let collectionName = queryModule.parseCollectionName(rawQuery);
      //
      // let collection = _getCollectionByNameFromRawQuery(collectionName);
      //
      // if (!collection) {
      //   $scope.error = 'Sorry, ' + collectionName + ' is not a valid collection name';
      //   $scope.loading = false;
      //   return;
      // }
      //
      // $scope.currentCollection = collection;

      // let query;
      // queryModule.createQuery(rawQuery)
      //   .then((_query) => {
      //     query = _query;
      //
      //     return collection.execQuery(query);
      //   })
      //   .then((result) => {
      //     $scope.$apply(() => {
      //       $scope.currentQuery = query;
      //       $scope.loading = false;
      //       $scope.queryTime = result.time;
      //       $scope.results = result.result;
      //
      //       if ($scope.results && _.isArray($scope.results)) {
      //         $scope.keyValueResults = keyValueUtils.convert($scope.results);
      //       }
      //
      //       if ($scope.currentQuery.mongoMethod === 'count') {
      //         $scope.currentView = $scope.VIEWS.RAW;
      //       } else if ($scope.currentView === $scope.VIEWS.RAW) {
      //         $scope.currentView = $scope.VIEWS.KEYVALUE;
      //       }
      //
      //       if ($scope.currentQuery.mongoMethod !== 'find' &&
      //         $scope.currentQuery.mongoMethod !== 'aggregate' &&
      //         $scope.currentQuery.mongoMethod !== 'count') {
      //         notificationService.success($scope.currentQuery.mongoMethod + ' was successful');
      //
      //         _runQuery('db.' + $scope.currentCollection.name + '.find()');
      //       }
      //     });
      //   })
      //   .catch((error) => {
      //     $scope.$apply(() => {
      //       $scope.error = error && error.message ? error.message : error;
      //       $scope.loading = false;
      //     });
      //   });
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
