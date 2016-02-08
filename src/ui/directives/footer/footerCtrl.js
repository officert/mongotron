'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');

    autoUpdater.checkForUpdates()
      .then(updateAvailable => {
        $scope.$apply(() => {
          logger.debug('UPDATE AVAILABLE');

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
