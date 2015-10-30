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

        //regexes for matching input to a mongo query type for autocomplete
        const FIND_QUERY = /^[\s\S]*find$/;
        const UPDATE_QUERY = /^[\s\S]*update$/;
        const REMOVE_QUERY = /^[\s\S]*remove$/;
        const AGGREGATE_QUERY = /^[\s\S]*aggregate$/;

        //defaults when autocomplete selection is made
        const FIND_DEFAULT = 'find({\n    \n})';
        const UPDATE_DEFAULT = 'update({\n    \n})';
        const REMOVE_DEFAULT = 'remove({\n    \n})';
        const AGGREGATE_DEFAULT = 'aggregate([\n    \n])';

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

            if (value.length === 1) editor.showHint();

            ngModelCtrl.$setViewValue(value && value.trim ? value.trim() : value);
          });

          editor.on('endCompletion', function() {
            var value = getFullValue(editor.getValue());
            editor.setValue(value);

            $timeout(function() {
              editor.setCursor(1, 4);
            });
          });

          editor.refresh();
        }

        function getFullValue(val) {
          if (val.match(FIND_QUERY)) {
            return FIND_DEFAULT;
          } else if (val.match(UPDATE_QUERY)) {
            return UPDATE_DEFAULT;
          } else if (val.match(REMOVE_QUERY)) {
            return REMOVE_DEFAULT;
          } else if (val.match(AGGREGATE_QUERY)) {
            return AGGREGATE_DEFAULT;
          }
        }
      }
    };
  }
]);
