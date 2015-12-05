angular.module('app').directive('keybindingContext', [
  'keypressService',
  function(keypressService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var contextName = attrs.keybindingContext;

        if (!contextName) throw new Error('keybindingContext - contextName is required');

        element.click(function(event) {
          if (event) event.stopPropagation();

          keypressService.changeCurrentContext(contextName);
        });
      }
    };
  }
]);
