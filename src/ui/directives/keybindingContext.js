'use strict';

angular.module('app').directive('keybindingContext', [
  'keypressService', (keypressService) => {
    return {
      restrict: 'A',
      link: (scope, element, attrs) => {
        let contextName = attrs.keybindingContext;

        if (!contextName) throw new Error('keybindingContext - contextName is required');

        element.click((event) => {
          if (event.originalEvent.keybindingContextHandled === true) { //event was already handled by a more specific context
            return;
          }

          keypressService.changeCurrentContext(contextName);

          event.originalEvent.keybindingContextHandled = true;
        });
      }
    };
  }
]);
