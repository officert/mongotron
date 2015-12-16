angular.module('app').directive('keyValueResult', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/keyValueResult/keyValueResult.html',
      controller: 'keyValueResultCtrl',
      scope: {
        result: '='
      }
    };
  }
]);
