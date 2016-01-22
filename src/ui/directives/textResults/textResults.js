'use strict';

angular.module('app').directive('textResults', [
  () => {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/keyValueResults/keyValueResults.html',
      controller: 'keyValueResultsCtrl',
      scope: {
        results: '='
      }
    };
  }
]);
