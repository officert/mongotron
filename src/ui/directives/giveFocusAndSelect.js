'use strict';

angular.module('app').directive('giveFocusAndSelect', [
  '$timeout',
  '$parse', ($timeout, $parse) => {
    return {
      link: (scope, element, attrs) => {
        let model = $parse(attrs.giveFocusAndSelect);
        scope.$watch(model, (value) => {
          if (value === true) {
            $timeout(() => {
              element.focus().select();
            });
          }
        });
      }
    };
  }
]);
