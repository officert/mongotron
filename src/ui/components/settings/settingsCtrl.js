angular.module('app').controller('settingsCtrl', [
  '$scope',
  function($scope) {
    $scope.setTitle('Settings');

    $scope.preferencesSrc = __dirname + '/components/settings/preferences/preferences.html';
    $scope.keybindingsSrc = __dirname + '/components/settings/keybindings/keybindings.html';
    $scope.themesSrc = __dirname + '/components/settings/keybindings/themes.html';

    $scope.currentPage = 'preferences';
  }
]);
