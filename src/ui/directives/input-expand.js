angular.module('app').directive('inputExpand', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var elementVal = element.val();

        element.data('oldVal', elementVal);

        adjustWidth(elementVal);

        // Look for changes in the value
        element.bind('propertychange change click keyup input paste', function() {
          var newVal = element.val();

          // If value has changed...
          if (element.data('oldVal') !== newVal) {
            adjustWidth(newVal);
          }
        });

        function adjustWidth(newVal) {
          if (!newVal) return;

          element.data('oldVal', newVal);

          var fontSize = parseFloat(element.css('font-size'));
          var adjustedWidth = (newVal.length * fontSize) + 'px';

          console.log('fontSize', fontSize);
          console.log('adjustedWidth', adjustedWidth);

          element.width(adjustedWidth);
        }
      }
    };
  }
]);
