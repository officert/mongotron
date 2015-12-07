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

  parseFunction(query) {
    return parser.parseFunction(query);
  }

  /**
   * Query Factory
   *
   * @method createQuery
   * @param {String} rawQuery
   * @param {Object} options
   * @param {Object} options.evalContext - context to evaluate the js express in
   */
  createQuery(rawQuery, options) {
    options = options || {};

    return new Promise((resolve, reject) => {
      var query = new Query();

      query.parse(rawQuery, options)
        .then(resolve)
        .catch(reject);
    });
  }
}

/**
 * @exports
 */
module.exports = new QueryService();
