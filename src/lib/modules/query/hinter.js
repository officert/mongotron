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

    if (!value || !DB_QUERY_REGEX.test(value)) {
      hints = ['db'];
    } else if (DB_QUERY_REGEX.test(value)) {
      hints = ['collection 1', 'collection 2'];
    } else {
      hints = QUERY_HINTS;
    }

    return {
      hints: hint,
      value: value
    };
  }
}

module.exports = new Hinter();
