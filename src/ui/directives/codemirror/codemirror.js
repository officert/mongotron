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

        var javascriptHintFn = $window.CodeMirror.hint.javascript;
        $window.CodeMirror.hint.javascript = customHint; //override the javascript autocomplete

        //regexes for matching input to a mongo query type for autocomplete
        const FIND_QUERY = /^[\s\S]*find$/;
        const UPDATE_QUERY = /^[\s\S]*update$/;
        const DELETE_MANY_QUERY = /^[\s\S]*deleteMany$/;
        const AGGREGATE_QUERY = /^[\s\S]*aggregate$/;
        const INSERT_ONE_QUERY = /^[\s\S]*insertOne$/;

        //defaults when autocomplete selection is made
        const FIND_DEFAULT = 'find({\n    \n})';
        const UPDATE_DEFAULT = 'update({\n    \n})';
        const DELETE_MANY_DEFAULT = 'deleteMany({\n    \n})';
        const AGGREGATE_DEFAULT = 'aggregate([\n    \n])';
        const INSERT_ONE_DEFAULT = 'insertOne({\n    \n})';

        options.lineNumbers = options.lineNumbers || true;
        options.extraKeys = options.extraKeys || {};
        options.extraKeys['Ctrl-Space'] = 'autocomplete';

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

          editor.on('change', function() {
            var value = editor.getValue();
            value = value && value.trim ? value.trim() : value;

            if (value.length === 1) editor.showHint();

            ngModelCtrl.$setViewValue(value);
          });

          editor.on('endCompletion', function() {
            var value = getFullValue(editor.getValue());
            editor.setValue(value);

            $timeout(function() {
              editor.setCursor(1, 4);
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

        function customHint(codemirror) {
          var currentValue = editor.getValue();

          var inner = javascriptHintFn(codemirror) || {
            from: codemirror.getCursor(),
            to: codemirror.getCursor(),
            list: []
          };

          inner.list = [];
          inner.list.push('aggregate');
          inner.list.push('find');
          inner.list.push('update');
          inner.list.push('deleteMany');
          inner.list.push('insertOne');

          // ---------------

          var term = $.ui.autocomplete.escapeRegex(currentValue);

          var startsWithMatcher = new RegExp("^" + term, "i");
          var startsWith = $.grep(inner.list, function(value) {
            return startsWithMatcher.test(value.label || value.value || value);
          });

          var containsMatcher = new RegExp(term, "i");
          var contains = $.grep(inner.list, function(value) {
            return $.inArray(value, startsWith) < 0 &&
              containsMatcher.test(value.label || value.value || value);
          });

          inner.list = startsWith.concat(contains);

          return inner;
        }



        function getFullValue(val) {
          if (val.match(FIND_QUERY)) {
            return FIND_DEFAULT;
          } else if (val.match(UPDATE_QUERY)) {
            return UPDATE_DEFAULT;
          } else if (val.match(DELETE_MANY_QUERY)) {
            return DELETE_MANY_DEFAULT;
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
