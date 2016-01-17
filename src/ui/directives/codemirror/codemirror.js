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
        handle: '=',
        customData: '='
      },
      link: (scope, element, attrs, ngModelCtrl) => {
        let editor;
        let options = scope.codemirror || {};

        scope.handle = scope.handle || {};
        scope.handle.autoformat = () => {
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
        ngModelCtrl.$formatters.push((modelValue) => {
          $timeout(() => {
            editor.setValue(modelValue);
          });
          return modelValue;
        });

        function init() {
          editor = new $window.CodeMirror((editorElement) => {
            element.append(editorElement);
          }, options);

          _.extend(editor, {
            customData: scope.customData
          });

          element.data('CodeMirrorInstance', editor); //make the instance available from the DOM

          editor.setOption('extraKeys', {
            Tab: (cm) => { //use spaces instead of tabs
              let spaces = new Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          });

          _registerEditorEvents();

          editor.refresh();
        }

        function _autoFormatSelection(codeMirrorEditor) {
          if (!codeMirrorEditor) return;

          let totalLines = codeMirrorEditor.lineCount();
          let totalChars = codeMirrorEditor.getValue().length;

          codeMirrorEditor.autoFormatRange({
            line: 0,
            ch: 0
          }, {
            line: totalLines,
            ch: totalChars
          });
        }

        function _showAutoComplete(cm, event) {
          if (event && (event.keyIdentifier.indexOf('Up') !== -1 || event.keyIdentifier.indexOf('Down') !== -1)) return;

          CodeMirror.commands.autocomplete(cm, null, {
            completeSingle: false
          });
        }

        function _registerEditorEvents() {
          editor.on('keyup', (cm, event) => {
            $timeout(() => {
              _showAutoComplete(cm, event);
            });
          });

          editor.on('change', () => {
            $timeout(() => {
              var value = editor.getValue();
              value = value && value.trim ? value.trim() : value;

              ngModelCtrl.$setViewValue(value);
            });
          });

          editor.on('focus', (cm) => {
            $timeout(() => {
              scope.hasFocus = true;

              var value = editor.getValue();

              if (!value) {
                _showAutoComplete(cm);
              }
            });
          });

          editor.on('blur', () => {
            $timeout(() => {
              scope.hasFocus = false;
            });
          });
        }
      }
    };
  }
]);

(function() {
  const hinter = require('lib/modules/query/hinter');

  CodeMirror.registerHelper('hint', 'javascript', (codemirror) => {
    let cursor = codemirror.getCursor();
    let currentQuery = codemirror.getValue();
    let currentWordRange = codemirror.findWordAt(cursor);
    let currentWord = codemirror.getRange(currentWordRange.anchor, currentWordRange.head).replace(/[^\w\s]/gi, '');
    let customData = codemirror.customData || [];

    let results = hinter.getHintsByValue(currentQuery, currentWord, {
      collectionNames: customData.collectionNames
    });

    let inner = {
      from: cursor,
      to: cursor,
      currentWord: currentWord,
      list: _filterAutoCompleteHintsByInput(results.value, results.hints || []) || []
    };

    return inner;
  });

  // https://github.com/codemirror/CodeMirror/issues/3092
  let javascriptHint = CodeMirror.hint.javascript;
  CodeMirror.hint.javascript = (codemirror, options) => {
    let codemirrorInstance = codemirror;

    let result = javascriptHint(codemirror, options);

    if (result) {
      CodeMirror.on(result, 'pick', (selectedHint) => {
        let cursor = codemirrorInstance.getCursor();
        let currentValue = codemirrorInstance.getValue();
        let newValue = currentValue.replace(result.currentWord + selectedHint, selectedHint);

        codemirrorInstance.setValue(newValue);

        let newChar = newValue.length;
        codemirrorInstance.setCursor(cursor.line, newChar);
      });
    }
    return result;
  };

  function _filterAutoCompleteHintsByInput(input, hints) {
    if (typeof input !== 'string') return null;
    if (!hints || !hints.length) return null;

    var term = $.ui.autocomplete.escapeRegex(input);

    var startsWithMatcher = new RegExp('^' + term, 'i');
    var startsWith = $.grep(hints, function(value) {
      return startsWithMatcher.test(value.label || value.value || value);
    });

    var containsMatcher = new RegExp(term, 'i');
    var contains = $.grep(hints, function(value) {
      return $.inArray(value, startsWith) < 0 &&
        containsMatcher.test(value.label || value.value || value);
    });

    return startsWith.concat(contains);
  }
}());
