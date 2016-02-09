'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  '$timeout',
  ($scope, $timeout) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');

    $scope.showPulse = true; //animate the update link

    $timeout(() => {
      $scope.showPulse = false;
    }, 20000);

    $scope.downloadUpdate = function($event) {
      if ($event) $event.preventDefault();

      autoUpdater.downloadNewRelease();
    };

    autoUpdater.checkForNewRelease()
      .then(updateAvailable => {
        $scope.$apply(() => {
          $scope.updateAvailable = updateAvailable;
        });
      })
      .catch(err => {
        $scope.$apply(() => {
          logger.error(err);
        });
      });
  }
]);
