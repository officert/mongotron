angular.module('app').controller('themesCtrl', [
  '$scope',
  '$log',
  'themeService',
  function($scope, $log, themeService) {
    $scope.currentTheme = themeService.currentTheme;

    themeService.list()
      .then(function(themes) {
        $scope.themes = themes;
      })
      .catch(function(err) {
        $log.error(err);
      });

    $scope.$watch('currentTheme', function(theme) {
      themeService.changeCurrent(theme);
    });
  }
]);
