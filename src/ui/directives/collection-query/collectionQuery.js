angular.module('app').directive('collectionQuery', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/collection-query/collectionQuery.html',
      controller: 'collectionQueryCtrl',
      scope: {
        collection: '='
      }
    };
  }
]);
