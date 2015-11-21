angular.module('app').controller('keybindingsCtrl', [
  '$scope',
  '$timeout',
  '$log',
  function($scope, $timeout, $log) {
    const keybindings = require('lib/modules/keybindings');

    $scope.searchForm = {
      searchQuery: ''
    };

    keybindings.list()
      .then(function(keybindings) {
        $timeout(function() {
          $scope.keybindings = keybindings.map(function(keybinding) {
            keybinding.keystrokeSpaced = keybinding.keystroke ? keybinding.keystroke.replace(/-/g, ' ') : '';
            return keybinding;
          });
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
