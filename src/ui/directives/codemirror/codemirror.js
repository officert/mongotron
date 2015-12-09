'use strict';

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
        const hinter = require('lib/modules/query/hinter');

        var editor;
        var options = scope.codemirror || {};

        scope.handle = scope.handle || {};
        scope.handle.autoformat = function() {
          _autoFormatSelection(editor);
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

          _registerEditorEvents();

          editor.refresh();

          $timeout(function() {
            editor.focus();
          });
        }

        function _autoFormatSelection(codeMirrorEditor) {
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

        function _showAutoComplete(cm, event) {
          if (cm.state.completionActive) return;
          if (event && event.keyCode === 13) return;

          CodeMirror.commands.autocomplete(cm, null, {
            completeSingle: false
          });
        }

        function _registerEditorEvents()  {
          editor.on('keyup', function(cm, event) {
            $timeout(function() {
              _showAutoComplete(cm, event);
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
                _showAutoComplete(cm, event);
              }
            });
          });

          editor.on('blur', function() {
            $timeout(function() {
              scope.hasFocus = false;
            });
          });

          editor.on('endCompletion', function() {
            console.log('AUTOCOMPLETE FINISHED');

            var editorValue = editor.getValue();

            console.log('editorValue', editorValue);

            // var value = getFullValue(editorValue);
            //
            // if (value) {
            //   codemirror.setValue(value);
            //   codemirror.setCursor(1, 4);
            // }
          });
        }
      }
    };
  }
]);

(() => {
  const hinter = require('lib/modules/query/hinter');

  CodeMirror.registerHelper('hint', 'javascript', function(codemirror) {
    var currentValue = codemirror.getValue();

    // var collectionNames = currentCollection && currentCollection.database ? _.pluck(currentCollection.database.collections, 'name') : [];

    let results = hinter.getHintsByValue(currentValue);

    let inner = {
      from: codemirror.getCursor(),
      to: codemirror.getCursor(),
      list: null
    };

    inner.list = results.hints;
    // inner.list = _filterAutoCompleteHintsByInput(results.value, results.hints) || [];

    return inner;
  });
}());
