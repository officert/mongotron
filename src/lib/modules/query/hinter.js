'use strict';

const _ = require('underscore');

const QUERY_TYPES = require('./queryTypes');
const QUERY_HINTS = _.keys(QUERY_TYPES);

const DB_QUERY_REGEX = /^db./;

class Hinter {
  getHintsByValue(value) {
    if (!value) return [];

    let hints = null;

    value = value.trim ? value.trim() : value;
    value = value.toLowerCase ? value.toLowerCase() : value;

    if (!value || !DB_QUERY_REGEX.test(value)) {
      hints = ['db'];
    } else if (DB_QUERY_REGEX.test(value)) {
      // hints = collectionNames;
    } else {
      hints = QUERY_HINTS;
    }

    return {
      hints: hints,
      value: value
    };
  }
}

module.exports = new Hinter();
