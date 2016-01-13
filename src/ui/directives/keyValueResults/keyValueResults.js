angular.module('app').directive('keyValueResults', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/keyValueResults/keyValueResults.html',
      controller: 'keyValueResultsCtrl',
      scope: {
        results: '=',
        deleteDocument: '='
      }
    };
  }
]);
