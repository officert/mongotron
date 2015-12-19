'use strict';

angular.module('app').controller('notificationCtrl', [
  '$scope',
  '$timeout',
  '$window',
  function($scope, $timeout, $window) {
    const ALERT_TIMEOUT = 3200;
    let timer;
    let removeNotificationOg = $scope.removeNotification;

    if (!$scope.notification) throw new Error('notification directive - notification is required on scope');

    $scope.clearTimer = _clearTimer;
    $scope.setTimer = _setTimer;
    $scope.removeNotification = _removeNotification;

    $timeout(() => {
      $scope.notification.show = true;
    });

    if (!$scope.notification.notimeout) {
      _setTimer();
    }

    function _setTimer() {
      if (!$scope.notification.notimeout) {
        timer = $window.setTimeout(() => {
          $timeout(() => {
            $scope.removeNotification($scope.notification);
          });
        }, ALERT_TIMEOUT);
      }
    }

    function _clearTimer() {
      $window.clearTimeout(timer);
    }

    function _removeNotification(notification) {
      $timeout(() => {
        $scope.notification.hide = true;
        $timeout(() => {
          _clearTimer();
          removeNotificationOg(notification);
        }, 200);
      });
    }
  }
]);
