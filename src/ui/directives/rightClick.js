'use strict';

angular.module('app').directive('ngRightClick', [
  '$parse', ($parse) => {
    return (scope, element, attrs) => {
      let fn = $parse(attrs.ngRightClick);

      element.bind('contextmenu', (event) => {
        scope.$apply(() => {
          event.preventDefault();
          return fn(scope, {
            $event: event
          });
        });
      });
    };
  }
]);
