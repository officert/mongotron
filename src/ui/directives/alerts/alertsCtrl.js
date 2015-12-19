'use strict';

angular.module('app').controller('alertsCtrl', [
  '$scope',
  'alertService',
  '$timeout',
  function($scope, alertService, $timeout) {
    const ALERT_TIMEOUT = 4000;

    $scope.alerts = [];

    alertService.on(alertService.EVENTS.NEW_ALERT, (alert) => {
      $timeout(() => {
        $scope.alerts.push(alert);
        $timeout(() => {
          var index = $scope.alerts.indexOf(alert);
          $scope.alerts.splice(index, 1);
        }, ALERT_TIMEOUT);
      });
    });

    $scope.removeAlert = function(alert) {
      let index = $scope.alerts.indexOf(alert);

      if (index > -1) {
        $scope.alerts.splice(index, 1);
      }
    };
  }
]);
