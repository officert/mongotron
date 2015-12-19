angular.module('app').directive('alerts', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/alerts/alerts.html',
      controller: 'alertsCtrl',
      scope: {}
    };
  }
]);
