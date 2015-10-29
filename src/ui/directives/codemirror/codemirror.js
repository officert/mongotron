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

        const FIND_QUERY = /^[\s\S]*find$/;
        const UPDATE_QUERY = /^[\s\S]*update$/;
        const REMOVE_QUERY = /^[\s\S]*remove$/;
        const AGGREGATE_QUERY = /^[\s\S]*aggregate$/;

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.extraKeys['Ctrl-Space'] = 'autocomplete';

        options.mode = {
          name: 'javascript',
          globalVars: true
        };

        init();

        ngModelCtrl.$formatters.push(function(modelValue) {
          console.log('formatter running...', modelValue);

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
            var value = editor.getValue();

            if(value.length === 1) editor.showHint();

            ngModelCtrl.$setViewValue(value && value.trim ? value.trim() : value);
          });

          editor.on('endCompletion', function() {
            var value = getFullValue(editor.getValue());
            editor.setValue(value);

            var char = 20;

            $timeout(function() {
              editor.setCursor({
                line: 1,
                ch: char
              });
            });
          });

          editor.refresh();
        }

        function getFullValue(val) {
          if (val.match(FIND_QUERY)) {
            return 'find({\n\n})';
          } else if (val.match(UPDATE_QUERY)) {
            return 'update({\n\n})';
          } else if (val.match(REMOVE_QUERY)) {
            return 'remove({\n\n})';
          } else if (val.match(AGGREGATE_QUERY)) {
            return 'aggregate([\n\n])';
          }
        }
      }
    };
  }
]);
