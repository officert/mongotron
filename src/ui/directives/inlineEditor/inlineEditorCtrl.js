'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope',
  'queryRunnerService',
  'tabCache',
  'notificationService', ($scope, queryRunnerService, tabCache, notificationService) => {
    const mongoUtils = require('src/lib/utils/mongoUtils');

    $scope.show = false;
    $scope.doc = $scope.inlineEditorDoc;
    $scope.newValue = $scope.inlineEditorValue;
    $scope.validType = $scope.inlineEditorType !== 'objectId';
    // $scope.newValue = _getPropertyValue($scope.doc, $scope.inlineEditorKey);

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

      let fullQuery = _getFullQuery(activeTab.collection.name);

      queryRunnerService.runQuery(fullQuery, activeTab.database.collections)
        .then(() => {
          $scope.show = false;
          _setPropertyValueByKey($scope.doc, $scope.inlineEditorKey, $scope.newValue);
          $scope.inlineEditorValue = $scope.newValue;
        })
        .catch((err) => {
          notificationService.error(err);
        });
    };

    $scope.cancel = function() {
      $scope.show = false;
    };

    function _getFullQuery(collectionName) {
      return 'db.' + collectionName + '.updateOne({ _id : ' + _getDocId($scope.doc) + ' }, { $set : { \'' + $scope.inlineEditorKey + '\' : \'' + $scope.newValue + '\' } })';
    }

    function _getDocId(doc) {
      if (!doc) return null;

      if (mongoUtils.isObjectId(doc._id)) return 'new ObjectId(\'' + doc._id.toString() + '\')';
      else return doc._id;
    }

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
