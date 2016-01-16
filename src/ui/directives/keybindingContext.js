angular.module('app').directive('keybindingContext', [
  'keypressService',
  function(keypressService) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var contextName = attrs.keybindingContext;

        if (!contextName) throw new Error('keybindingContext - contextName is required');

        element.click(function(event) {
          // if (event) event.stopPropagation();  //TODO: figure out a better way to do this, doing it this way means no other events will bubble up the entire doc

          keypressService.changeCurrentContext(contextName);
        });
      }
    };
  }
]);
