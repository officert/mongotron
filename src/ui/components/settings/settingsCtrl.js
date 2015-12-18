angular.module('app').controller('settingsCtrl', [
  '$scope',
  function($scope) {
    $scope.preferencesSrc = __dirname + '/components/settings/preferences/preferences.html';
    $scope.keybindingsSrc = __dirname + '/components/settings/keybindings/keybindings.html';
    $scope.themesSrc = __dirname + '/components/settings/themes/themes.html';

    $scope.currentPage = 'preferences';
  }
]);
