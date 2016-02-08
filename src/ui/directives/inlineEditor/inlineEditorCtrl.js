'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope',
  'tabCache',
  'notificationService',
  '$timeout', ($scope, tabCache, notificationService, $timeout) => {
    const expression = require('lib/modules/expression');

    $scope.show = false;
    $scope.doc = $scope.inlineEditorDoc;
    $scope.newValue = $scope.inlineEditorValue;
    $scope.validType = $scope.inlineEditorType !== 'objectId';

    $scope.$watch('show', (val) => {
      if (val === true) {
        $scope.$emit('inline-editor-show', $scope.doc.id, $scope.inlineEditorKey);
      } else {
        $scope.newValue = $scope.inlineEditorValue;
        // $scope.newValue = $scope.doc[$scope.inlineEditorKey];
      }
    });

    $scope.$on('inline-editor-hide', (docId, propName) => {
      if (docId === $scope.doc.id && $scope.inlineEditorKey !== propName) {
        $scope.show = false;
      }
    });

    $scope.keydown = function($event) {
      if ($event) {
        if ($event.keyCode === 27) {
          $scope.show = false;
        } else if ($event.keyCode === 13) {
          $scope.saveChanges();
        }
      }
    };

    $scope.saveChanges = () => {
      let activeTab = tabCache.getActive();

      if (!activeTab) return;

      let evalScope = {
        doc: $scope.doc
      };

      expression.eval($scope.newValue, evalScope)
        .then(expressionResult => {
          let set = {};
          set[$scope.inlineEditorKey] = expressionResult.result;

          activeTab.collection.updateOne({
              _id: $scope.doc._id
            }, {
              $set: set
            })
            .then(() => {
              $timeout(() => {
                $scope.show = false;

                _setPropertyValueByKey($scope.doc, $scope.inlineEditorKey, expressionResult.result);

                $scope.inlineEditorValue = expressionResult.result;

                notificationService.success('Updates saved.');
              });
            })
            .catch((err) => {
              $timeout(() => {
                notificationService.error(err);
              });
            });
        })
        .catch(err => {
          $timeout(() => {
            notificationService.error(err);
          });
        });
    };

    $scope.cancel = function() {
      $scope.show = false;
    };

    function _setPropertyValueByKey(obj, prop, val) {
      if (!obj || !prop) return null;

      if (prop.indexOf('.') < 0) {
        obj[prop] = val;
      } else {
        let parts = prop.split('.').map(s => {
          return s.trim();
        });

        for (let i = 0; i < parts.length; i++) {
          let key = parts[i];

          if (i === (parts.length - 1)) {
            obj[key] = val;
          } else {
            obj = obj[key];
          }
        }
      }

      return val;
    }

    // function _getPropertyValueByKey(obj, prop) {
    //   if (!obj || !prop) return null;
    //
    //   let val = null;
    //
    //   if (prop.indexOf('.') < 0) {
    //     val = obj[prop];
    //   } else {
    //     let parts = prop.split('.').map(s => {
    //       return s.trim();
    //     });
    //
    //     for (let i = 0; i < parts.length; i++) {
    //       let key = parts[i];
    //
    //       if (i === (parts.length - 1)) {
    //         val = obj[key];
    //       } else {
    //         obj = obj[key];
    //       }
    //     }
    //   }
    //
    //   return val;
    // }
  }
]);
