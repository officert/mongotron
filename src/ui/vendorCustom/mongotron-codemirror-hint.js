(function(CodeMirror) {
  'use strict';

  CodeMirror.registerHelper('hint', 'javascript', function(codemirror) {

    var currentValue = codemirror.getValue();

    var inner = {
      from: codemirror.getCursor(),
      to: codemirror.getCursor(),
      list: [
        'aggregate',
        'find',
        'updateOne',
        'updateMany',
        'deleteOne',
        'deleteMany',
        'insertOne'
      ]
    };

    inner.list = filterAutoCompleteHintsByInput(currentValue, inner.list);

    return inner;
  });

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
