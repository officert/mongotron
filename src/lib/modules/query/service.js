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
    var _this = this;

    options = options || {};

    return new Promise((resolve, reject) => {
      if (!_this.isValidQuery(rawQuery)) return reject(new Error('Invalid query'));

      var functionName = _this.parseFunction(rawQuery);

      if (!functionName) return reject(new Error('Invalid mongo function'));

      var query = new Query(functionName);

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
