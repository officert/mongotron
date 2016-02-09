'use strict';

angular.module('app').controller('updatesCtrl', [
  '$scope', ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');
    const appConfig = require('src/config/appConfig');

    $scope.version = appConfig.version;
    $scope.latestRelease = null;

    $scope.downloadUpdate = function() {
      autoUpdater.downloadNewRelease();
    };

    autoUpdater.checkForNewRelease()
      .then(updateAvailable => {
        $scope.$apply(() => {
          $scope.updateAvailable = updateAvailable;

          $scope.latestRelease = autoUpdater.latestRelease;
        });
      })
      .catch(err => {
        $scope.$apply(() => {
          logger.error(err);
        });
      });
  }
]);
