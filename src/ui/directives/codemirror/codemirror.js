'use strict';

angular.module('app').directive('codemirror', [
  '$window',
  '$timeout', ($window, $timeout) => {
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
        scope.handle.refresh = () => {
          _refresh(editor);
        };

        const TAB = '  '; //2 spaces

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.tabSize = TAB.length;
        options.indentWithTabs = false;
        options.autofocus = true;
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

          $timeout(() => {
            _refresh(editor);
            $timeout(() => { //TODO: figure out a better way - sometimes the editor styles are screwed up, re-freshing helps but this isn't ideal
              _refresh(editor);
            }, 500);
          });
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

        function _refresh(codeMirrorEditor) {
          codeMirrorEditor.refresh();
        }

        function _registerEditorEvents() {
          editor.on('keyup', (cm, event) => {
            if (!cm.state.completionActive && (event.keyCode !== 13 && event.keyCode !== 27)) {
              CodeMirror.commands.autocomplete(cm, null, {
                completeSingle: false
              });
            }
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

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function() {
  const esprima = require('esprima');
  const ObjectId = require('mongodb').ObjectId;

  var Pos = CodeMirror.Pos;

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) !== -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(),
      token = getToken(editor, cur);
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch,
        end: cur.ch,
        string: "",
        state: token.state,
        type: token.string === "." ? "property" : null
      };
    } else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    var tprop = token;
    let context = [];
    // If it is a property, find out what it is a property of.
    while (tprop.type === "property") {
      tprop = getToken(editor, new Pos(cur.line, tprop.start));
      if (tprop.string !== ".") return;
      tprop = getToken(editor, new Pos(cur.line, tprop.start));
      if (!context) context = [];
      context.push(tprop);
    }

    //add some additional global variables
    options.globalScope = {
      db: editor.customData.db,
      ObjectId: ObjectId
    };
    options.additionalContext = {};

    let tokens = esprima.tokenize(editor.getValue());
    let lastToken = tokens[tokens.length - 1];

    return {
      list: (lastToken && lastToken.type !== 'Punctuator' || (lastToken.type === 'Punctuator' && lastToken.value === '.')) ? getCompletions(token, context, keywords, options) : [],
      from: new Pos(cur.line, token.start),
      to: new Pos(cur.line, token.end)
    };
  }

  function javascriptHint(editor, options) {
    return scriptHint(editor, javascriptKeywords,
      function(e, cur) {
        return e.getTokenAt(cur);
      },
      options);
  }

  CodeMirror.registerHelper("hint", "javascript", javascriptHint);

  var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
    "toUpperCase toLowerCase split concat match replace search").split(" ");
  var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
    "lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
  var funcProps = "prototype apply call bind".split(" ");
  var javascriptKeywords = ("break case catch continue debugger default delete do else false finally for function " +
    "if in instanceof new null return switch throw true try typeof var void while with").split(" ");

  function getCompletions(token, context, keywords, options) {
    var found = [],
      start = token.string,
      global = options && options.globalScope || window;

    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) === 0 && !arrayContains(found, str)) found.push(str);
    }

    function gatherCompletions(obj) {
      if (typeof obj === "string") _.each(stringProps, maybeAdd);
      else if (obj instanceof Array) _.each(arrayProps, maybeAdd);
      else if (obj instanceof Function) _.each(funcProps, maybeAdd);
      for (var name in obj) maybeAdd(name);
    }

    if (context && context.length) {
      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      var obj = context.pop(),
        base;
      if (obj.type && obj.type.indexOf("variable") === 0) {
        if (options && options.additionalContext)
          base = options.additionalContext[obj.string];
        if (!options || options.useGlobalScope !== false)
          base = base || global[obj.string];
      } else if (obj.type === "string") {
        base = "";
      } else if (obj.type === "atom") {
        base = 1;
      } else if (obj.type === "function") {
        if (global.jQuery !== null && (obj.string === '$' || obj.string === 'jQuery') &&
          (typeof global.jQuery === 'function'))
          base = global.jQuery();
        else if (global._ !== null && (obj.string === '_') && (typeof global._ === 'function'))
          base = global._();
      }
      while (base !== null && context.length)
        base = base[context.pop().string];
      if (base !== null) gatherCompletions(base);
    } else {
      // If not, just look in the global object and any local scope
      // (reading into JS mode internals to get at the local and global variables)
      for (let v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
      for (let v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
      if (!options || options.useGlobalScope !== false)
        gatherCompletions(global);
      _.each(keywords, maybeAdd);
    }
    return found;
  }
}());
