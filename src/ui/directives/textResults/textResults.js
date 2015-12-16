angular.module('app').directive('textResults', [
  function() {
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
