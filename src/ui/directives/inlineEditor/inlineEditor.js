'use strict';

angular.module('app').directive('inlineEditor', [
  '$templateRequest',
  '$compile', ($templateRequest, $compile) => {
    const uuid = require('node-uuid');

    return {
      restrict: 'A',
      replace: true,
      controller: 'inlineEditorCtrl',
      scope: {
        'inlineEditorKey': '@',
        'inlineEditorValue': '=',
        'inlineEditorDoc': '='
      },
      link: (scope, element) => {
        scope.id = uuid.v4();

        $templateRequest(__dirname + '/directives/inlineEditor/inlineEditor.html')
          .then((html) => {
            let template = angular.element(html);
            element.append(template);
            $compile(template)(scope);
          });

        $('html').on('click.' + scope.id, (e) => {
          let target = $(e.target);
          let inlineEditorControl = element.find('.inline-editor input');
          let elId = target.attr('inline-editor-id');
          let id = inlineEditorControl.attr('inline-editor-id');

          scope.$apply(() => {
            if (elId !== id) scope.show = false;
          });
        });

        scope.$on('$destroy', () => {
          $('html').off('click.' + scope.id);
        });
      }
    };
  }
]);
