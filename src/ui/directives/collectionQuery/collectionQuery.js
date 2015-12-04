angular.module('app').directive('collectionQuery', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/collectionQuery/collectionQuery.html',
      controller: 'collectionQueryCtrl',
      scope: {
        collection: '='
      }
    };
  }
]);
