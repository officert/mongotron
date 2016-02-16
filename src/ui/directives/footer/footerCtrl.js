'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  '$timeout',
  ($scope, $timeout) => {
    const shell = require('electron').shell;

    const autoUpdater = require('lib/modules/autoupdater');
    const logger = require('lib/modules/logger');
    const appConfig = require('src/config/appConfig');

    $scope.version = appConfig.version;

    $scope.showPulse = false;

    $scope.downloadUpdate = function($event) {
      if ($event) $event.preventDefault();

      let latestRelease = autoUpdater.latestRelease;

      if (!latestRelease) return;

      shell.openExternal(latestRelease.url);
    };

    autoUpdater.checkForNewRelease()
      .then(updateAvailable => {
        $scope.$apply(() => {
          $scope.updateAvailable = updateAvailable;

          if ($scope.updateAvailable) {
            //start the pulse animation
            $timeout(() => {
              $scope.showPulse = false;
            }, 20000);
          }
        });
      })
      .catch(err => {
        $scope.$apply(() => {
          logger.error(err);
        });
      });
  }
]);
