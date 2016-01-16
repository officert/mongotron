'use strict';

angular.module('app').directive('giveFocus', [
  '$timeout',
  '$parse', ($timeout, $parse) => {
    return {
      link: (scope, element, attrs) => {
        var model = $parse(attrs.giveFocus);
        scope.$watch(model, (value) => {
          if (value === true) {
            $timeout(() => {
              element[0].focus();
            });
          }
        });
      }
    };
  }
]);
