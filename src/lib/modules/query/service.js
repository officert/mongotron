'use strict';

const Promise = require('bluebird');

const Query = require('./query');
const parser = require('./parser');

/**
 * @class QueryService
 */
class QueryService {
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
 * @exports
 */
module.exports = new QueryService();
