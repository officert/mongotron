angular.module('app').directive('codemirror', [
  '$window',
  '$timeout',
  function($window, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        codemirror: '=',
        hasFocus: '=',
        handle: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        var editor;
        var options = scope.codemirror || {};

        scope.handle = scope.handle || {};
        scope.handle.autoformat = function() {
          autoFormatSelection(editor);
        };

        const TAB = '  '; //2 spaces

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.tabSize = TAB.length;
        options.indentWithTabs = false;
        options.mode = {
          name: 'javascript',
          globalVars: true
        };

        init();

        //take initial model value and set editor with it
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

          element.data('CodeMirrorInstance', editor); //make the instance available from the DOM

          editor.setOption('extraKeys', {
            Tab: function(cm) { //use spaces instead of tabs
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          });

          editor.on('keyup', function(cm, event) {
            $timeout(function() {
              showAutoComplete(cm, event);
            });
          });

          editor.on('change', function() {
            $timeout(function() {
              var value = editor.getValue();
              value = value && value.trim ? value.trim() : value;

              ngModelCtrl.$setViewValue(value);
            });
          });

          editor.on('focus', function(cm, event) {
            $timeout(function() {
              scope.hasFocus = true;

              var value = editor.getValue();

              if (!value) {
                showAutoComplete(cm, event);
              }
            });
          });

          editor.on('blur', function() {
            $timeout(function() {
              scope.hasFocus = false;
            });
          });

          editor.refresh();

          $timeout(function() {
            editor.focus();
          });
        }

        function autoFormatSelection(codeMirrorEditor) {
          if (!codeMirrorEditor) return;

          var totalLines = codeMirrorEditor.lineCount();
          var totalChars = codeMirrorEditor.getValue().length;

          codeMirrorEditor.autoFormatRange({
            line: 0,
            ch: 0
          }, {
            line: totalLines,
            ch: totalChars
          });
        }

        function showAutoComplete(cm, event) {
          if (cm.state.completionActive) return;
          if (event && event.keyCode === 13) return;

          CodeMirror.commands.autocomplete(cm, null, {
            completeSingle: false
          });
        }
      }
    };
  }
]);
