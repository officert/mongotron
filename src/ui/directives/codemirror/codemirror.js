angular.module('app').directive('codemirror', [
  '$window',
  '$timeout',
  function($window, $timeout) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        codemirror: '=',
        hasFocus: '='
      },
      link: function(scope, element, attrs, ngModelCtrl) {
        var editor;
        var options = scope.codemirror || {};

        //regexes for matching input to a mongo query type for autocomplete
        const FIND_QUERY = /^[\s\S]*find$/;
        const UPDATE_MANY_QUERY = /^[\s\S]*updateMany$/;
        const UPDATE_ONE_QUERY = /^[\s\S]*updateOne$/;
        const DELETE_MANY_QUERY = /^[\s\S]*deleteMany$/;
        const DELETE_ONE_QUERY = /^[\s\S]*deleteOne$/;
        const AGGREGATE_QUERY = /^[\s\S]*aggregate$/;
        const INSERT_ONE_QUERY = /^[\s\S]*insertOne$/;

        //defaults when autocomplete selection is made
        const FIND_DEFAULT = 'find({\n    \n})';
        const UPDATE_MANY_DEFAULT = 'updateMany({\n    \n}, {\n    $set : {\n    \n    }\n})';
        const UPDATE_ONE_DEFAULT = 'updateOne({\n    \n}, {\n    $set : {\n    \n    }\n})';
        const DELETE_MANY_DEFAULT = 'deleteMany({\n    \n}, {\n    \n})';
        const DELETE_ONE_DEFAULT = 'deleteOne({\n    \n}, {\n    \n})';
        const AGGREGATE_DEFAULT = 'aggregate([\n    \n])';
        const INSERT_ONE_DEFAULT = 'insertOne({\n    \n})';

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        // options.extraKeys['Ctrl-Space'] = 'autocomplete';

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

          element.data('CodeMirrorInstance', editor);

          editor.on('keyup', function(cm, event) {
            if (!cm.state.completionActive && event.keyCode !== 13) {
              CodeMirror.commands.autocomplete(cm, null, {
                completeSingle: false
              });
            }
          });

          editor.on('change', function() {
            var value = editor.getValue();
            value = value && value.trim ? value.trim() : value;

            $timeout(function() {
              ngModelCtrl.$setViewValue(value);
            });
          });

          editor.on('endCompletion', function() {
            var editorValue = editor.getValue();
            var value = getFullValue(editorValue);

            $timeout(function() {
              if (value) {
                editor.setValue(value);
                editor.setCursor(1, 4);
              }
            });
          });

          editor.on('focus', function() {
            $timeout(function() {
              scope.hasFocus = true;
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

        /* -----------------------------------------------
        /* Private Helpers
        /* ----------------------------------------------- */

        function getFullValue(val) {
          if (val.match(FIND_QUERY)) {
            return FIND_DEFAULT;
          } else if (val.match(UPDATE_MANY_QUERY)) {
            return UPDATE_MANY_DEFAULT;
          } else if (val.match(UPDATE_ONE_QUERY)) {
            return UPDATE_ONE_DEFAULT;
          } else if (val.match(DELETE_MANY_QUERY)) {
            return DELETE_MANY_DEFAULT;
          } else if (val.match(DELETE_ONE_QUERY)) {
            return DELETE_ONE_DEFAULT;
          } else if (val.match(AGGREGATE_QUERY)) {
            return AGGREGATE_DEFAULT;
          } else if (val.match(INSERT_ONE_QUERY)) {
            return INSERT_ONE_DEFAULT;
          }
        }
      }
    };
  }
]);
