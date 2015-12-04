'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$modalInstance',
  'results',
  'collection',
  function($scope, $modalInstance, results, collection) {
    $scope.results = results;
    $scope.collection = collection;

    $scope.queryResultsExportHandle = {};

    $scope.close = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.export = function() {
      $scope.queryResultsExportHandle.export();
    };

    $scope.saveConfig = function() {
      $scope.queryResultsExportHandle.saveConfig();
    };
  }
]);
