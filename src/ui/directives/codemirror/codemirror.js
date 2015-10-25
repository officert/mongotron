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
          var orig = $window.CodeMirror.hint.javascript;

          $window.CodeMirror.hint.javascript = function(cm) {
            var inner = orig(cm) || {
              from: cm.getCursor(),
              to: cm.getCursor(),
              list: []
            };
            inner.list = [];
            inner.list.push('aggregate');
            inner.list.push('find');
            inner.list.push('update');
            inner.list.push('remove');

            return inner;
          };

          editor = new $window.CodeMirror(function(editorElement) {
            element.append(editorElement);
          }, options);

          editor.on('change', function() {
            var v = editor.getValue();
            ngModelCtrl.$setViewValue(v);
          });

          // editor.on('keyup', function(cm, event) {
          //   if (!cm.state.completionActive && event.keyCode !== 13) {
          //     // CodeMirror.commands.autocomplete(cm, null, {
          //     //   completeSingle: false
          //     // });
          //     editor.showHint();
          //   }
          // });

          editor.refresh();
        }
      }
    };
  }
]);
