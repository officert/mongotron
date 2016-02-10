'use strict';

angular.module('app').controller('aboutCtrl', [
  '$scope',
  ($scope) => {
    const appConfig = require('src/config/appConfig');
    const githubApi = require('lib/libs/githubApi');
    const logger = require('lib/modules/logger');

    $scope.version = appConfig.version;

    githubApi.listReleases(appConfig.repositoryOwner, appConfig.repositoryName)
      .then(releases => {
        $scope.$apply(() => {
          $scope.currentRelease = _.findWhere(releases, {
            tag_name: $scope.version //jshint ignore:line
          });
        });
      })
      .catch(err => {
        logger.error(err);
      });
  }
]);
