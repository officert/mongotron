(function(CodeMirror) {
  'use strict';

  const _ = require('underscore');
  const queryModule = require('lib/modules/query');

  const QUERY_HINTS = _.keys(queryModule.QUERY_TYPES);

  // const CONSTRUCTOR_HINTS = [
  //   'ObjectId'
  // ];

  // const CONSTRUCTOR_REGEX = /^(?:[^]+)new ([a-zA-Z]+)(?:[^]+)$/;

  // //regexes for matching input to a mongo query type for autocomplete
  // const FIND_QUERY = /^[\s\S]*find$/;
  // const UPDATE_MANY_QUERY = /^[\s\S]*updateMany$/;
  // const UPDATE_ONE_QUERY = /^[\s\S]*updateOne$/;
  // const DELETE_MANY_QUERY = /^[\s\S]*deleteMany$/;
  // const DELETE_ONE_QUERY = /^[\s\S]*deleteOne$/;
  // const AGGREGATE_QUERY = /^[\s\S]*aggregate$/;
  // const INSERT_ONE_QUERY = /^[\s\S]*insertOne$/;
  //
  // //defaults when autocomplete selection is made
  // const FIND_DEFAULT = 'find({\n' + TAB + '\n})';
  // const UPDATE_MANY_DEFAULT = 'updateMany({\n' + TAB + '\n}, {\n' + TAB + '$set : {\n' + TAB + '\n' + TAB + '}\n})';
  // const UPDATE_ONE_DEFAULT = 'updateOne({\n' + TAB + '\n}, {\n    $set : {\n    \n    }\n})';
  // const DELETE_MANY_DEFAULT = 'deleteMany({\n' + TAB + '\n})';
  // const DELETE_ONE_DEFAULT = 'deleteOne({\n' + TAB + '\n})';
  // const AGGREGATE_DEFAULT = 'aggregate([\n' + TAB + '\n])';
  // const INSERT_ONE_DEFAULT = 'insertOne({\n' + TAB + '\n})';

  CodeMirror.registerHelper('hint', 'javascript', function(codemirror) {

    var currentValue = codemirror.getValue();

    var results = getHintsByValue(currentValue);

    var inner = {
      from: codemirror.getCursor(),
      to: codemirror.getCursor(),
      list: results.hints
    };

    inner.list = filterAutoCompleteHintsByInput(results.value, inner.list);

    // codemirror.on('endCompletion', function() {
    //   console.log('AUTOCOMPLETE FINISHED');
    //
    //   var editorValue = codemirror.getValue();
    //   var value = getFullValue(editorValue);
    //
    //   if (value) {
    //     codemirror.setValue(value);
    //     codemirror.setCursor(1, 4);
    //   }
    // });

    return inner;
  });

  function getFullValue(val) {
    return val;
    // if (val.match(FIND_QUERY)) {
    //   return FIND_DEFAULT;
    // } else if (val.match(UPDATE_MANY_QUERY)) {
    //   return UPDATE_MANY_DEFAULT;
    // } else if (val.match(UPDATE_ONE_QUERY)) {
    //   return UPDATE_ONE_DEFAULT;
    // } else if (val.match(DELETE_MANY_QUERY)) {
    //   return DELETE_MANY_DEFAULT;
    // } else if (val.match(DELETE_ONE_QUERY)) {
    //   return DELETE_ONE_DEFAULT;
    // } else if (val.match(AGGREGATE_QUERY)) {
    //   return AGGREGATE_DEFAULT;
    // } else if (val.match(INSERT_ONE_QUERY)) {
    //   return INSERT_ONE_DEFAULT;
    // }
  }

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
})(CodeMirror);
