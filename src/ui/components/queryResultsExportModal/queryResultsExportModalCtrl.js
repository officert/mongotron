'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$modalInstance',
  'results',
  function($scope, $modalInstance, results) {
    $scope.results = results;

    $scope.close = function() {
      $modalInstance.dismiss('cancel');
    };
  }
]);
