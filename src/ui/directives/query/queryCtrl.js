'use strict';

angular.module('app').controller('queryCtrl', [
  '$scope',
  '$rootScope',
  'notificationService',
  'modalService',
  '$timeout',
  'menuService', ($scope, $rootScope, notificationService, modalService, $timeout, menuService) => {
    const expression = require('lib/modules/expression');
    const mongoUtils = require('lib/utils/mongoUtils');

    if (!$scope.database) throw new Error('database is required for database query directive');
    if (!$scope.database.collections || !$scope.database.collections.length) throw new Error('database must have collections for database query directive');

    $scope.loading = false;
    $scope.queryTime = null;

    $scope.databaseName = $scope.database.name;

    //editor
    $scope.editorHandle = {};
    $scope.codeEditorOptions = {};

    $scope.codeEditorCustomData = {
      db: {}
    };

    $scope.database.collections.forEach(collection => {
      $scope.codeEditorCustomData.db[collection.name] = collection.autoCompleteOptions;
    });

    $scope.editorHasFocus = false;

    $scope.results = [];
    $scope.keyValueResults = [];

    $scope.deleteDocument = _deleteDocument;
    $scope.editDocument = _editDocument;

    let defaultCollection = $scope.defaultCollection ? _.findWhere($scope.database.collections, {
      name: $scope.defaultCollection
    }) : null;

    defaultCollection = defaultCollection || $scope.database.collections[0];

    //check for bracket notation
    let expressionCollectionName = defaultCollection.name.indexOf('.') > 0 ? `['${defaultCollection.name}']` : `.${defaultCollection.name}`;

    let defaultExpression = `db${expressionCollectionName}.find({\n  \n})`;

    $scope.openDocumentContextMenu = (doc) => {
      if (!doc) return;

      menuService.showMenu([{
        label: 'Edit Document',
        click: () => {
          $timeout(() => {
            $scope.editDocument(doc.original);
          });
        }
      }, {
        label: 'Delete Document',
        click: () => {
          $timeout(() => {
            $scope.deleteDocument(doc.original);
          });
        }
      }]);
    };

    $scope.changeTabName = (name) => {
      if (!name || !$scope.databaseTab) return;
      $scope.databaseTab.name = name.length > 20 ? `${name.substring(0, 20)}...` : name;
    };

    $scope.changeTabName(defaultExpression);

    $scope.form = {
      expression: defaultExpression
    };

    $scope.evaluateExpression = () => {
      _evalExpression($scope.form.expression);
    };

    $scope.VIEWS = {
      TEXT: 'TEXT',
      KEYVALUE: 'KEYVALUE',
      RAW: 'RAW'
    };
    $scope.currentView = $scope.VIEWS.KEYVALUE;

    _evalExpression(defaultExpression);

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
          runQuery: $scope.evaluateExpression,
          autoformat: $scope.autoformat,
          comment: $scope.comment
        };
      } else {
        $rootScope.currentQuery = null;
      }
    });

    $scope.exportResults = () => {
      modalService.openQueryResultsExport($scope.form.expression);
    };

    $scope.collapseAll = () => {
      $scope.$broadcast('collapse');
    };

    function _evalExpression(rawExpression) {
      $scope.loading = true;
      $scope.error = null;

      $scope.changeTabName(rawExpression);

      let evalScope = _createEvalScopeFromCollections($scope.database.collections);

      expression.eval(rawExpression, evalScope)
        .then(expressionResult => {
          $scope.$apply(() => {
            $scope.result = expressionResult.result;
            $scope.resultMongoMethodName = expressionResult.mongoMethodName;
            $scope.queryTime = expressionResult.time;
            $scope.keyValueResults = expressionResult.keyValueResults || [];
            for (let i = 0; i < $scope.keyValueResults.length; i++) {
              $scope.keyValueResults[i]._index = i;
            }

            if (expressionResult.mongoCollectionName && expressionResult.mongoMethodName !== 'count') {
              $scope.currentCollection = _.findWhere($scope.database.collections, {
                name: expressionResult.mongoCollectionName
              });

              if (_isModifyingMongoMethod(expressionResult.mongoMethodName)) {
                notificationService.success(`${expressionResult.mongoMethodName} was successful`);

                let isBracketNotation = mongoUtils.isBracketNotation(expressionResult.mongoCollectionName);
                let expression = isBracketNotation ? `db['${expressionResult.mongoCollectionName}'].find()` : `db.${expressionResult.mongoCollectionName}.find()`;

                return _evalExpression(expression, $scope.database.collections);
              }
            } else {
              $scope.currentView = $scope.VIEWS.RAW;
            }
          });
        })
        .catch((error) => {
          $scope.$apply(() => {
            $scope.error = error && error.message ? `Error : ${error.message} \n\n ${error.stack}` : error;
            $scope.loading = false;
          });
        })
        .finally(() => {
          $timeout(() => {
            $scope.loading = false;
          });
        });
    }

    function _createEvalScopeFromCollections(collections) {
      let evalScope = {
        db: {}
      };

      collections.forEach(collection => {
        evalScope.db[collection.name] = collection;
      });

      return evalScope;
    }

    function _isModifyingMongoMethod(methodName) {
      return methodName && (methodName === 'updateMany' || methodName === 'updateById' || methodName === 'updateOne' || methodName === 'deleteMany' || methodName === 'deleteById' || methodName === 'deleteOne');
    }

    function _deleteDocument(doc) {
      if (!doc) return;

      modalService.openDeleteDocument(doc, $scope.currentCollection)
        .then(() => {
          $scope.$apply(() => {
            notificationService.success('Delete successful');

            _evalExpression(`db.${$scope.currentCollection.name}.find()`);
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

      modalService.openEditDocument(doc, $scope.currentCollection)
        .then(() => {
          $scope.$apply(() => {
            notificationService.success('Update successful');

            _evalExpression(`db.${$scope.currentCollection.name}.find()`);
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
