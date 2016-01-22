'use strict';

angular.module('app').directive('imageSrc', [
  () => {
    const path = require('path');

    return {
      restrict: 'A',
      replace: true,
      template: '<img src="{{ src }}">',
      link: (scope, element, attrs) => {
        scope.src = path.join(__dirname, attrs.imageSrc);
      }
    };
  }
]);
