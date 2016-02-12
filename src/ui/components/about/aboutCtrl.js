'use strict';

angular.module('app').controller('aboutCtrl', [
  '$scope',
  ($scope) => {
    const appConfig = require('src/config/appConfig');
    const githubApi = require('lib/libs/githubApi');
    const logger = require('lib/modules/logger');

    $scope.version = appConfig.version;

    _getLatestRelease();

    function _getLatestRelease() {
      $scope.loading = true;

      githubApi.listReleases(appConfig.repositoryOwner, appConfig.repositoryName)
        .then(releases => {
          $scope.$apply(() => {
            $scope.loading = false;
            $scope.currentRelease = _.findWhere(releases, {
              tag_name: $scope.version //jshint ignore:line
            });
          });
        })
        .catch(err => {
          $scope.loading = false;
          $scope.error = err && err.message ? err.message : err;
          logger.error(err);
        });
    }
  }
]);
