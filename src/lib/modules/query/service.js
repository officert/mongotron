'use strict';

const Promise = require('bluebird');

const Query = require('./query');
const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');

/**
 * @class QueryService
 */
class QueryService {
  get QUERY_TYPES() {
    return QUERY_TYPES;
  }

  isValidQuery(query) {
    return parser.isValidQuery(query);
  }

  parseCollectionName(query) {
    return parser.parseCollectionName(query);
  }

  parseFunctionName(query) {
    return parser.parseFunctionName(query);
  }

  /**
   * Query Factory
   *
   * @method createQuery
   * @param {String} rawQuery
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

/**
 * @exports QueryService
 */
module.exports = new QueryService();
