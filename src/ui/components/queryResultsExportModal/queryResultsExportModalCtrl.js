'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$modalInstance',
  'results',
  'collection',
  'query',
  function($scope, $modalInstance, results, collection, query) {
    $scope.results = results;
    $scope.collection = collection;
    $scope.query = query;

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
