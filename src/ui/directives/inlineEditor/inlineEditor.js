'use strict';

angular.module('app').directive('inlineEditor', [
  '$templateRequest',
  '$compile', ($templateRequest, $compile) => {
    return {
      restrict: 'A',
      replace: true,
      controller: 'inlineEditorCtrl',
      scope: {
        'inlineEditorKey': '@',
        'inlineEditorValue': '@',
        'inlineEditorDoc': '@'
      },
      link: (scope, element) => {
        $templateRequest(__dirname + '/directives/inlineEditor/inlineEditor.html')
          .then((html) => {
            let template = angular.element(html);
            element.append(template);
            $compile(template)(scope);
          });
      }
    };
  }
]);
