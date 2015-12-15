'use strict';

const _ = require('underscore');
const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;

const evaluator = require('./evaluator');
const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');

class Query {
  constructor() {}

  parse(rawQuery) {
    let _this = this;

    _this.rawQuery = rawQuery;

    return new Promise((resolve, reject) => {
      if (_this.invalid) return reject(new Error(_this.invalidReason));

      if (!rawQuery) return reject(new Error('Query - parse() : rawQuery is required'));

      if (!parser.isValidQuery(rawQuery)) return reject(new Error('Invalid query'));

      var functionName = parser.parseFunctionName(rawQuery);

      if (!functionName) return reject(new Error('error parsing function'));

      var queryType = QUERY_TYPES[functionName];

      if (!queryType) return reject(new Error(functionName + ' is not a supported query'));

      _.extend(_this, queryType);

      let query = _parseRawQuery(rawQuery, {
        methodName: _this.mongoMethod,
        extractOptions: _this.extractOptions,
        requireOptions: _this.requireOptions
      });

      if (_.isError(query)) return reject(query);
      if (!query || !query.query) return reject(new Error('error parsing query'));

      _this.query = query.query;
      _this.queryOptions = query.queryOptions;

      return resolve(_this);
    });
  }
}

/**
 * @method _parseRawQuery - parses a raw query, ex. 'db.users.find({...})'
 * @param {String} rawQuery
 * @param {Object} options
 * @param {String} options.methodName  - name of them mongo method that is trying to be executed
 * @param {Bool} options.extractOptions - whether or not we should parse a 2nd options objects (update, updateMany)
 * @returns
 */
function _parseRawQuery(rawQuery, options) {
  options = options || {};

  var evalScope = {
    ObjectId: ObjectId
  };

  var query = null;
  var queryOptions = null;

  if (!options.extractOptions) {
    let rawQueryValue = parser.parseQuery(rawQuery);

    if (!rawQueryValue) return new Error('error parsing query');

    // rawQueryValue = ('(' + rawQueryValue + ')');

    query = evaluator.eval(rawQueryValue, evalScope);

    if (_.isError(query)) return query;
  } else {
    let rawQueryValue = parser.parseQuery(rawQuery);
    let rawOptionsValue = parser.parseOptions(rawQuery);

    if (!rawQueryValue) return new Error('error parsing query');
    if (!rawOptionsValue && options.requireOptions) return new Error('query options are required for mongo ' + options.methodName);

    query = evaluator.eval(rawQueryValue, evalScope);
    if (rawOptionsValue) queryOptions = evaluator.eval(rawOptionsValue, evalScope);

    if (_.isError(query)) return query;
    if (_.isError(queryOptions)) return queryOptions;
  }

  return {
    query: query,
    queryOptions: queryOptions
  };
}

module.exports = Query;
