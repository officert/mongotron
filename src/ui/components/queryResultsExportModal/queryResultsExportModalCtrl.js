'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$uibModalInstance',
  'collection',
  'query',
  function($scope, $uibModalInstance, collection, query) {
    $scope.collection = collection;
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
