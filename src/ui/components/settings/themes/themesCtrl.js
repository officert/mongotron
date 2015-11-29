angular.module('app').controller('themesCtrl', [
  '$scope',
  '$log',
  'themeService',
  function($scope, $log, themeService) {
    themeService.list()
      .then(function(themes) {
        $scope.themes = themes;
        $scope.currentTheme = _.findWhere($scope.themes, {
          active: true
        });
      })
      .catch(function(err) {
        $log.error(err);
      });

    $scope.$watch('currentTheme', function(theme) {
      if (!theme) return;

      themeService.changeActive(theme.name)
        .catch(function(err) {
          $log.error(err);
        });
    });
  }
]);
