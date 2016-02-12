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

angular.module('app').directive('markdownCompiled', [
  '$compile', ($compile) => {
    const shell = require('shell');

    return {
      restrict: 'A',
      scope: {
        markdownCompiled: '='
      },
      link: (scope, element) => {
        scope.$watch('markdownCompiled', newValue => {
          if (newValue && newValue !== '') {
            let html = marked(newValue);
            let $html = $(html);

            $html.find('a').each((index, el) => {
              $(el).attr('ng-click', 'openExternal(\'' + el.href + '\', $event)');
            });

            scope.openExternal = function(url, $event) {
              if (!url) return;

              if ($event) $event.preventDefault();

              shell.openExternal(url);
            };

            let compiled = $compile($html)(scope);

            element.html(compiled);
          }
        });
      }
    };
  }
]);
