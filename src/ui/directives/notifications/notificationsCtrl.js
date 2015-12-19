'use strict';

angular.module('app').controller('notificationsCtrl', [
  '$scope',
  'notificationService',
  '$timeout',
  function($scope, notificationService, $timeout) {
    $scope.notifications = [];

    notificationService.on(notificationService.EVENTS.NEW_NOTIFICATION, (notification) => {
      $timeout(() => {
        $scope.notifications.push(notification);
      });
    });

    $scope.removeNotification = function(notification) {
      let index = $scope.notifications.indexOf(notification);

      if (index > -1) {
        $scope.notifications.splice(index, 1);
      }
    };
  }
]);
