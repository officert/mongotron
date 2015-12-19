angular.module('app').directive('notification', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: __dirname + '/directives/notifications/notification.html',
      controller: 'notificationCtrl',
      scope: {
        notification: '='
      }
    };
  }
]);
