'use strict';

angular.module('app').controller('queryResultsExportModalCtrl', [
  '$scope',
  '$uibModalInstance',
  'collection',
  'query',
  function($scope, $uibModalInstance, collection, query) {
    const Query = require('lib/modules/query/query');

    $scope.collection = collection;
    $scope.query = query;

    if (!($scope.query instanceof Query)) throw new Error('queryResultsExportModal directive - $scope.query must be an instance of Query');

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
