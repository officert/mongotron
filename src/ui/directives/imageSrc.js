var path = require('path');

angular.module('app').directive('imageSrc', [
  function() {
    return {
      restrict: 'A',
      replace: true,
      template: '<img src="{{ src }}">',
      link: function(scope, element, attrs) {
        scope.src = path.join(__dirname, attrs.imageSrc);
      }
    };
  }
]);
