'use strict';

angular.module('app').controller('footerCtrl', [
  '$scope',
  '$timeout',
  ($scope, $timeout) => {
    const autoUpdater = require('lib/modules/autoupdater');
    const logger = require('lib/modules/logger');
    const shell = require('electron').shell;

    $scope.showPulse = true; //animate the update link

    $timeout(() => {
      $scope.showPulse = false;
    }, 20000);

    $scope.downloadUpdate = function() {
      let latestRelease = autoUpdater.latestRelease;

      if (!latestRelease) return;

      shell.openExternal(latestRelease.url);
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
