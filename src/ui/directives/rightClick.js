angular.module('app').directive('ngRightClick', [
  '$parse',
  function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);

      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          return fn(scope, {
            $event: event
          });
        });
      });

    };
  }
]);
