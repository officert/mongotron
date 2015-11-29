(function(CodeMirror) {
  'use strict';

  const QUERY_HINTS = [
    'aggregate',
    'find',
    'updateOne',
    'updateMany',
    'deleteOne',
    'deleteMany',
    'insertOne'
  ];

  // const CONSTRUCTOR_HINTS = [
  //   'ObjectId'
  // ];

  // const CONSTRUCTOR_REGEX = /^(?:[^]+)new ([a-zA-Z]+)(?:[^]+)$/;

  CodeMirror.registerHelper('hint', 'javascript', function(codemirror) {

    var currentValue = codemirror.getValue();

    var results = getHintsByValue(currentValue);

    var inner = {
      from: codemirror.getCursor(),
      to: codemirror.getCursor(),
      list: results.hints
    };

    inner.list = filterAutoCompleteHintsByInput(results.value, inner.list);

    return inner;
  });

  function getHintsByValue(value) {
    //TODO: https://regex101.com/r/uK9lU0/1
    // var constructorMatches = value.match(CONSTRUCTOR_REGEX);
    //
    // if (constructorMatches && constructorMatches.length && constructorMatches.length >= 2) {
    //   return {
    //     hints: CONSTRUCTOR_HINTS,
    //     value: constructorMatches[1]
    //   };
    // }

    return {
      hints: QUERY_HINTS,
      value: value
    };
  }

  /* -----------------------------------------------
  /* Private Helpers
  /* ----------------------------------------------- */

  /**
   * @function filterAutoCompleteHintsByInput
   *
   * @param {String} input - text input from the CodeMirror editor
   * @param {Array<String>} - list of autocompletion hints
   * @private
   */
  function filterAutoCompleteHintsByInput(input, hints) {
    var term = $.ui.autocomplete.escapeRegex(input);

    var startsWithMatcher = new RegExp("^" + term, "i");
    var startsWith = $.grep(hints, function(value) {
      return startsWithMatcher.test(value.label || value.value || value);
    });

    var containsMatcher = new RegExp(term, "i");
    var contains = $.grep(hints, function(value) {
      return $.inArray(value, startsWith) < 0 &&
        containsMatcher.test(value.label || value.value || value);
    });

    return startsWith.concat(contains);
  }
})(CodeMirror);
