angular.module('app').controller('keybindingsCtrl', [
  '$scope',
  '$timeout',
  '$log',
  function($scope, $timeout, $log) {
    const keybindings = require('lib/modules/keybindings');

    keybindings.list()
      .then(function(keybindings) {
        $timeout(function() {
          $scope.keybindings = keybindings;
        });
      })
      .catch(function(err) {
        $timeout(function() {
          $log.error(err);
        });
      });

    $scope.getHtmlForKeystroke = function(keystroke) {
      if (!keystroke) return null;

      var parts = keystroke.split('-');

      var html = '';

      parts.forEach(function(part) {
        html += ('<span class="keystroke-key">' + part + '</span>');
      });

      return html;
    };
  }
]);
