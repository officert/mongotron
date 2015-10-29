var path = require('path');

angular.module('app').directive('imageSrc', [
  function() {
    return {
      restrict: 'A',
      replace: true,
      template: '<img src="{{ src }}">',
      link: function(scope, element, attrs) {
        console.log('attrs.imageSrc', attrs.imageSrc);

        var newSrc = path.join(__dirname, attrs.imageSrc);

        console.log('newSrc', newSrc);

        scope.src = newSrc;
      }
    };
  }
]);
