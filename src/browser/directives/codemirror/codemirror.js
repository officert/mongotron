angular.module('app').directive('codemirror', [
  '$window',
  '$timeout',
  function($window, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        codemirror: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        var editor;
        var options = scope.codemirror || {};

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.extraKeys['Ctrl-Space'] = 'autocomplete';
        options.mode = {
          name: 'javascript',
          globalVars: true
        };

        init();

        ngModelCtrl.$formatters.push(function(modelValue) {
          $timeout(function() {
            editor.setValue(modelValue);
          });
          return modelValue;
        });

        function init() {
          editor = new $window.CodeMirror(function(editorElement) {
            element.append(editorElement);
          }, options);

          editor.on('change', function() {
            var v = editor.getValue();
            ngModelCtrl.$setViewValue(v);
          });

          editor.refresh();
        }
      }
    };
  }
]);
