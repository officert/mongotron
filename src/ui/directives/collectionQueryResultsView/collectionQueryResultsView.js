angular.module('app').directive('collectionQueryResultsView', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/collectionQueryResultsView/collectionQueryResultsView.html',
      controller: 'collectionQueryResultsViewCtrl',
      scope: {
        type: '=',
        results: '=',
        deleteResult: '='
      }
    };
  }
]);
