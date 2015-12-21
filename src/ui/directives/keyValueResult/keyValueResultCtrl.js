'use strict';

angular.module('app').controller('keyValueResultCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.result) throw new Error('keyValueResult directive - result is required on scope');
    console.log('RESULT');
    console.log($scope.result);

    $scope.$watch('result', (val) => {
      console.log('WATCH result');
      console.log(val);
    });
  }
]);
