angular.module('app').directive('notifications', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/notifications/notifications.html',
      controller: 'notificationsCtrl',
      scope: {}
    };
  }
]);
