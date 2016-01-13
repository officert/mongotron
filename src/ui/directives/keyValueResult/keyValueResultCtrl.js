'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope', ($scope) => {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');

    if ($scope.$parent.level !== null && $scope.$parent.level !== undefined) {
      $scope.level = parseInt($scope.$parent.level) + 1;
    } else {
      $scope.level = 1;
    }

    $scope.$on('collapse', () => {
      $scope.result.isOpen = false;
    });
  }
]);
