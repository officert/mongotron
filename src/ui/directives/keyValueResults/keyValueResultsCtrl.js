'use strict';

angular.module('app').controller('keyValueResultsCtrl', [
  '$scope',
  function($scope) {
    if (!$scope.results) throw new Error('keyValueResults directive - results is required on scope');
  }
]);
