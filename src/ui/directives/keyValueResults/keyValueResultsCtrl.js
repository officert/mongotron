'use strict';

angular.module('app').controller('keyValueResultsCtrl', [
  '$scope',
  function($scope) {
    $scope.__keyValueResults = $scope.results;
  }
]);
