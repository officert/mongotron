angular.module('app').directive('splitter', [
  function() {
    return {
      restrict: 'A',
      scope: {

      },
      link: function(scope, element, attrs) {
        element.split({
          orientation: attrs.orientation || 'vertical',
          limit: attrs.limit || 10,
          position: attrs.position || '50%'
        });
      }
    };
  }
]);
