'use strict';

angular.module('app').directive('keybindingContext', [
  'keypressService', (keypressService) => {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        var contextName = attrs.keybindingContext;

        if (!contextName) throw new Error('keybindingContext - contextName is required');

        element.click(() => {
          keypressService.changeCurrentContext(contextName);
        });
      }
    };
  }
]);
