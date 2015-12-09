'use strict';

const _ = require('underscore');

const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');
const QUERY_HINTS = _.keys(QUERY_TYPES);

class Hinter {
  getHintsByValue(value) {
    if (!value) return [];

    let hints = null;

    value = value.trim ? value.trim() : value;
    value = value.toLowerCase ? value.toLowerCase() : value;

    let collectionName = parser.parseCollectionName(value);
    let functionName = parser.parseFunctionName(value);

    var collectionNameRegex = new RegExp('[\\s\\S]+' + collectionName + '\.[\\s\\S]*');

    if (!value || !value.startsWith('db.')) {
      hints = ['db'];
    } else if (value.startsWith('db.') && (!collectionName || !collectionNameRegex.test(value))) {
      // hints = collectionNames;
      hints = ['collection1', 'collection2', 'collection3'];
    } else if (collectionName && collectionNameRegex.test(value) && functionName) {
      hints = QUERY_HINTS;
    }

    return {
      hints: hints || [],
      value: value
    };
  }
}

module.exports = new Hinter();
