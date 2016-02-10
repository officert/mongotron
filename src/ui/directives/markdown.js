'use strict';

angular.module('app').directive('markdown', [
  () => {
    return {
      restrict: 'A',
      scope: {
        markdown: '='
      },
      link: (scope, element) => {
        scope.$watch('markdown', newValue => {
          if (newValue && newValue !== '') {
            let html = marked(newValue);
            element.html(html);
          }
        });
      }
    };
  }
]);
