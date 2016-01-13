'use strict';

angular.module('app').controller('inlineEditorCtrl', [
  '$scope', ($scope) => {
    $scope.show = false;

    $scope.save = function() {
      alert('save!');
    };

    $scope.cancel = function() {
      $scope.show = false;
    };
  }
]);
