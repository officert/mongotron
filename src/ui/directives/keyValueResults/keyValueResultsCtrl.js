'use strict';

angular.module('app').controller('keyValueResultsCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.results) throw new Error('keyValueResults directive - results is required on scope');
    // console.log('RESULTS');
    // console.log($scope.results);
    //
    // $scope.$watch('results', (val) => {
    //   console.log('WATCH results');
    //   console.log(val);
    // });
  }
]);
