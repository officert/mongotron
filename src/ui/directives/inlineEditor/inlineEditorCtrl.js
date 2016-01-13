'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope',
  'queryRunnerService', ($scope, queryRunnerService) => {
    $scope.show = false;
    $scope.doc = _.extend({}, $scope.inlineEditorDoc);

    $scope.$watch('show', (val) => {
      if (val === true) {
        $scope.$emit('inline-editor-show', $scope.doc.id, $scope.inlineEditorKey);
      }
    });

    $scope.$on('inline-editor-hide', (docId, propName) => {
      if (docId === $scope.doc.id && $scope.inlineEditorKey !== propName) {
        $scope.show = false;
      }
    });

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
