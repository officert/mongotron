'use strict';

angular.module('app').controller('updatesCtrl', [
  '$scope', ($scope) => {
    const autoUpdater = require('lib/modules/autoUpdater');
    const logger = require('lib/modules/logger');
    const appConfig = require('src/config/appConfig');
    const shell = require('electron').shell;

    $scope.version = appConfig.version;
    $scope.latestRelease = null;

    $scope.downloadUpdate = function() {
      let latestRelease = autoUpdater.latestRelease;

      if (!latestRelease) return;

      shell.openExternal(latestRelease.url);
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
