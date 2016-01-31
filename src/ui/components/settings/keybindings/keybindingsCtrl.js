'use strict';

angular.module('app').controller('keybindingsCtrl', [
  '$scope',
  '$timeout', ($scope, $timeout) => {
    const keybindings = require('lib/modules/keybindings');
    const logger = require('lib/modules/logger');

    $scope.searchForm = {
      searchQuery: ''
    };

    keybindings.list()
      .then(keybindings => {
        $timeout(() => {
          $scope.keybindings = keybindings.map(keybinding => {
            keybinding.keystrokeSpaced = keybinding.keystroke ? keybinding.keystroke.replace(/-/g, ' ') : '';
            return keybinding;
          });
        });
      })
      .catch(err => {
        $timeout(() => {
          logger.error(err);
        });
      });

    $scope.getHtmlForKeystroke = keystroke => {
      if (!keystroke) return null;

      let parts = keystroke.split('-');

      let html = '';

      parts.forEach(part => {
        html += ('<span class="keystroke-key">' + part + '</span>');
      });

      return html;
    };
  }
]);
