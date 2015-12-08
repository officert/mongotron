angular.module('app').directive('query', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/query/query.html',
      controller: 'queryCtrl',
      scope: {
        database: '=',
        databaseTab: '=',
        defaultCollection: '='
      }
    };
  }
]);
