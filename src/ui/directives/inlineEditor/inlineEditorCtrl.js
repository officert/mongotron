'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope',
  'queryRunnerService', ($scope, queryRunnerService) => {
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
      alert('save changes');

      queryRunnerService.runQuery('db.' + $scope.collection.name + 'updateOne({ id : ' + $scope.doc.id + ' })', $scope.collections)
        .then(() => {

        })
        .catch((err) => {
          alert(err);
        });
    };

    $scope.cancel = function() {
      $scope.show = false;
    };
  }
]);
