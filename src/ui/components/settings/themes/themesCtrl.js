'use strict';

angular.module('app').controller('themesCtrl', [
  '$scope',
  'themeService',
  '$timeout', ($scope, themeService, $timeout) => {
    const logger = require('lib/modules/logger');

    themeService.list()
      .then((themes) => {
        $scope.themes = themes;
        $scope.currentTheme = _.findWhere($scope.themes, {
          active: true
        });
      })
      .catch((err) => {
        logger.error(err);
      });

    $scope.selectTheme = theme => {
      if (!theme) return;

      $scope.themes.forEach((th) => {
        th.active = false;
      });

      themeService.changeActive(theme.name)
        .then(() => {
          $timeout(() => {
            theme.active = true;
          });
        })
        .catch((err) => {
          logger.error(err);
        });
    };
  }
]);
