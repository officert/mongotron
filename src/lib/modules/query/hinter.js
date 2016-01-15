'use strict';

const _ = require('underscore');

const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');
const QUERY_HINTS = _.keys(QUERY_TYPES);

/** @module Query */
/** @class */
class Hinter {
  /**
   * @param {String} value - value to provide automcomplete hints for
   * @param {Object} options
   * @param {Array<String>} options.collectionNames
   */
  getHintsByValue(fullQuery, currentWord, options) {
    if (!fullQuery) return [];
    options = options && _.isObject(options) ? options : [];

    let hints = null;
    let value = null;

    value = fullQuery.trim ? fullQuery.trim() : fullQuery;
    value = fullQuery.toLowerCase ? fullQuery.toLowerCase() : fullQuery;

    let collectionName = parser.parseCollectionName(fullQuery);
    let functionName = parser.parseFunctionName(fullQuery);

    // var collectionNameRegex = collectionName ? new RegExp('[\\s\\S]+' + collectionName + '\.[\\s\\S]*') : null;
    // var collectionNamePlusFunctionRegex = collectionName ? new RegExp('[\\s\\S]+' + collectionName + '\.[a-zA-Z0-9]*\\(') : null;

    var collectionNameRegex = collectionName ? new RegExp('[\\s\\S]+\.' + collectionName + '\\.[\\s\\S]*', 'i') : null;
    var collectionNamePlusFunctionRegex = collectionName ? new RegExp('[\\s\\S]+\.' + collectionName + '\\.[a-zA-Z0-9]*\\(', 'i') : null;

    if (!value || !value.startsWith('db.')) {
      //root expression hints
      hints = ['db.'];
    } else if (value.startsWith('db.') && (!collectionName || !collectionNameRegex.test(value))) {
      //collection expression hints
      hints = options.collectionNames.map(function(collection) {
        return collection + '.';
      }) || [];
      value = collectionName || '';
    } else if (collectionName && collectionNameRegex.test(value) && !collectionNamePlusFunctionRegex.test(value)) {
      //function expression hints
      hints = QUERY_HINTS.map(function(hintFunction) {
        return hintFunction + '(';
      });
      value = functionName || '';
    } else if (currentWord.length) {
      value = currentWord;
      hints = [
        'ObjectId('
      ];
    }

    return {
      hints: hints || [],
      value: value
    };
  }
}

module.exports = new Hinter();
