angular.module('app').directive('codemirror', [
  '$window',
  function($window) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        codemirror: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        var options = scope.codemirror || {};
        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.extraKeys['Ctrl-Space'] = 'autocomplete';
        options.mode = {
          name: 'javascript',
          globalVars: true
        };
        options.hintWords = function(editor, opts) {
          console.log('GOT HERE');
        };

        var editor = new $window.CodeMirror(function(editorElement) {
          element.append(editorElement);
        }, options);

        editor.on('change', function(event, value) {
          ngModelCtrl.$setViewValue(editor.getValue());;
        });
      }
    };
  }
]);
