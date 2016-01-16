'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope',
  'queryRunnerService',
  'tabCache',
  'notificationService', ($scope, queryRunnerService, tabCache, notificationService) => {
    $scope.show = false;
    $scope.doc = _.extend({}, $scope.inlineEditorDoc);
    $scope.newValue = $scope.doc[$scope.inlineEditorKey];

    $scope.$watch('show', (val) => {
      if (val === true) {
        $scope.$emit('inline-editor-show', $scope.doc.id, $scope.inlineEditorKey);
      } else {
        $scope.newValue = $scope.doc[$scope.inlineEditorKey];
      }
    });

    $scope.$on('inline-editor-hide', (docId, propName) => {
      if (docId === $scope.doc.id && $scope.inlineEditorKey !== propName) {
        $scope.show = false;
      }
    });

    $scope.keydown = function($event) {
      if ($event && $event.keyCode === 27) {
        $scope.show = false;
      }
    };

    $scope.saveChanges = () => {
      let activeTab = tabCache.getActive();

      if (!activeTab) return;

      let fullQuery = _getFullQuery(activeTab.collection.name);

      queryRunnerService.runQuery(fullQuery, activeTab.database.collections)
        .then(() => {
          notificationService.success('yay!!');
        })
        .catch((err) => {
          notificationService.error(err);
        });
    };

    $scope.cancel = function() {
      $scope.show = false;
    };

    function _getFullQuery(collectionName) {
      return 'db.' + collectionName + '.updateOne({ id : ' + $scope.doc._id.toString() + ' }, { $set : { ' + $scope.inlineEditorKey + ' : \'' + $scope.newValue + '\' } })';
    }
  }
]);
