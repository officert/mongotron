'use strict';

const Promise = require('bluebird');

const Query = require('./query');
const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');

/** @module Query */
/** @class */
class QueryService {
  get QUERY_TYPES() {
    return QUERY_TYPES;
  }

  /**
   * @param {string} query - query to check validation on
   * @returns {boolean}
   */
  isValidQuery(query) {
    return parser.isValidQuery(query);
  }

  /**
   * @param {string} query - query to parse collection name from
   * @returns {string}
   */
  parseCollectionName(query) {
    return parser.parseCollectionName(query);
  }

  /**
   * @param {string} query - query to parse function name from
   * @returns {string}
   */
  parseFunctionName(query) {
    return parser.parseFunctionName(query);
  }

  /**
   * @param {string} rawQuery - raw query to parse
   * @returns {Query}
   */
  createQuery(rawQuery) {
    return new Promise((resolve, reject) => {
      var query = new Query();

      query.parse(rawQuery)
        .then(resolve)
        .catch(reject);
    });
  }
}

module.exports = new QueryService();
