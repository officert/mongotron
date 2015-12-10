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
      link: function(scope, element, attrs, ngModelCtrl) {
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

          _.extend(editor, {
            customData: scope.customData
          });

          element.data('CodeMirrorInstance', editor); //make the instance available from the DOM

          editor.setOption('extraKeys', {
            Tab: function(cm) { //use spaces instead of tabs
              var spaces = new Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces);
            }
          });

          _registerEditorEvents();

          editor.refresh();
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

        function _registerEditorEvents() {
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
        }
      }
    };
  }
]);

(() => {
  const hinter = require('lib/modules/query/hinter');

  CodeMirror.registerHelper('hint', 'javascript', function(codemirror) {
    var currentValue = codemirror.getValue();

    let customData = codemirror.customData || [];

    let results = hinter.getHintsByValue(currentValue, {
      collectionNames: customData.collectionNames
    });

    let inner = {
      from: codemirror.getCursor(),
      to: codemirror.getCursor(),
      list: null
    };

    inner.list = results.hints || [];
    // inner.list = _filterAutoCompleteHintsByInput(results.value, results.hints || []) || [];

    return inner;
  });


  // https://github.com/codemirror/CodeMirror/issues/3092
  let javascriptHint = CodeMirror.hint.javascript;
  CodeMirror.hint.javascript = function(codemirror, options) {
    var codemirrorInstance = codemirror;

    var result = javascriptHint(codemirror, options);

    if (result) {
      CodeMirror.on(result, 'pick', function(selectedHint) {
        var currentValue = codemirrorInstance.getValue();

        var previousValue = currentValue.substring(0, currentValue.indexOf(selectedHint));

        var parts = previousValue.split('.');
        parts.pop();
        parts.push(selectedHint);

        var newValue = parts.length > 1 ? parts.join('.') : parts[0];

        codemirrorInstance.setValue(newValue);
      });
    }
    return result;
  };

  // function _filterAutoCompleteHintsByInput(input, hints) {
  //   if (!input) return null;
  //   if (!hints || !hints.length) return null;
  //
  //   var term = $.ui.autocomplete.escapeRegex(input);
  //
  //   var startsWithMatcher = new RegExp('^' + term, 'i');
  //   var startsWith = $.grep(hints, function(value) {
  //     return startsWithMatcher.test(value.label || value.value || value);
  //   });
  //
  //   var containsMatcher = new RegExp(term, 'i');
  //   var contains = $.grep(hints, function(value) {
  //     return $.inArray(value, startsWith) < 0 &&
  //       containsMatcher.test(value.label || value.value || value);
  //   });
  //
  //   return startsWith.concat(contains);
  // }
}());
