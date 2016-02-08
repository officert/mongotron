'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');

    autoUpdater.checkForUpdates();

    autoUpdater.on(autoUpdater.EVENTS.UPDATE_AVAILABLE, () => {
      $scope.$apply(() => {
        logger.debug('UPDATE AVAILABLE');

        $scope.updateAvailable = true;
      });
    });
  }
]);
