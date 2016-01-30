'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$uibModalInstance',
  'query',
  function($scope, $uibModalInstance, query) {
    $scope.query = query;

    $scope.queryResultsExportHandle = {};

    $scope.close = function() {
      $uibModalInstance.dismiss('cancel');
    };

    $scope.export = function() {
      $scope.queryResultsExportHandle.export();
    };

    $scope.saveConfig = function() {
      $scope.queryResultsExportHandle.saveConfig();
    };
  }
]);
