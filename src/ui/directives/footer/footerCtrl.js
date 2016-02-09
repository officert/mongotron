'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');

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
