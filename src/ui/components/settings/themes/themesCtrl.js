'use strict';

angular.module('app').controller('themesCtrl', [
  '$scope',
  '$log',
  'themeService',
  '$timeout',
  function($scope, $log, themeService, $timeout) {
    themeService.list()
      .then((themes) => {
        $scope.themes = themes;
        $scope.currentTheme = _.findWhere($scope.themes, {
          active: true
        });
      })
      .catch((err) => {
        $log.error(err);
      });

    $scope.selectTheme = function(theme) {
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
          $log.error(err);
        });
    };

    // $scope.$watch('currentTheme', function(theme) {
    //   if (!theme) return;
    //
    //   themeService.changeActive(theme.name)
    //     .catch(function(err) {
    //       $log.error(err);
    //     });
    // });
  }
]);
