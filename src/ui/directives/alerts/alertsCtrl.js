'use strict';

angular.module('app').controller('alertsCtrl', [
  '$scope',
  'alertService',
  '$timeout',
  function($scope, alertService, $timeout) {
    $scope.alerts = [];

    alertService.on(alertService.EVENTS.NEW_ALERT, (alert) => {
      $timeout(() => {
        $scope.alerts.push(alert);
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
