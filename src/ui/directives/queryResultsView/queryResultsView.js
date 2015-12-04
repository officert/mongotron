angular.module('app').directive('queryResultsView', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/queryResultsView/queryResultsView.html',
      controller: 'queryResultsViewCtrl',
      scope: {
        type: '=',
        results: '=',
        deleteResult: '='
      }
    };
  }
]);
