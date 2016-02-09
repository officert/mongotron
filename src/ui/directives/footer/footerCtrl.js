'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');

    autoUpdater.checkForNewRelease()
      .then(newRelease => {
        $scope.$apply(() => {
          logger.info('UPDATE AVAILABLE', newRelease);

          $scope.updateAvailable = true;
        });
      })
      .catch(err => {
        $scope.$apply(() => {
          logger.error(err);
        });
      });
  }
]);
