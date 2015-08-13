angular.module('app').directive('collectionQuery', [
  function() {
    return {
      restrict: 'E',
      templateUrl: __dirname + '/directives/collection-query/collectionQuery.html',
      controller: 'collectionQueryCtrl',
      scope: {
        collection: '='
      }
    };
  }
]);
