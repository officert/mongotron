'use strict';

const _ = require('underscore');
const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;

const parser = require('./parser');

const QUERY_TYPES = require('./queryTypes');

class Query {
  constructor(functionName) {
    this.rawQuery = null; //the full raw query ex. 'db.users.find({ .... })'

    var queryType = QUERY_TYPES[functionName] || {};

    if (!queryType) {
      this.invalid = true;
      this.invalidReason = functionName + ' is not a valid mongo query';
    } else {
      _.extend(this, queryType);
    }
  }

  parse(rawQuery, options) {
    let _this = this;
    options = options || {};

    _this.rawQuery = rawQuery;

    return new Promise((resolve, reject) => {
      if (_this.invalid) return reject(new Error(_this.invalidReason));

      if (!rawQuery) return reject(new Error('Query - parse() : rawQuery is required'));

      if (!parser.isValidQuery(rawQuery)) return reject(new Error('Invalid query'));

      var functionName = parser.parseFunction(rawQuery);

      if (!functionName) return reject(new Error('Invalid mongo function'));

      let query = _parseRawQuery(rawQuery, {
        methodName: _this.mongoMethod,
        extractOptions: _this.extractOptions,
        evalContext: options.evalContext || {}
      });

      if (!query || !query.query) return reject(new Error('error parsing query'));
      if (_.isError(query)) return reject(query);

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
 * @param {Object} options.evalContext - context to evalulate the js expression in
 * @returns
 */
function _parseRawQuery(rawQuery, options) {
  options = options || {};

  var query = null;
  var queryOptions = null;

  if (!options.extractOptions) {
    let rawQueryValue = parser.parseQuery(rawQuery);

    if (!rawQueryValue) return new Error('error parsing query');

    query = _evalQueryValue(rawQueryValue, options.evalContext);

    if (_.isError(query)) return new Error('error evaluating query');
  } else {
    let rawQueryValue = parser.parseQuery(rawQuery);
    let rawOptionsValue = parser.parseOptions(rawQuery);

    if (!rawQueryValue) return new Error('error parsing query');
    if (!rawOptionsValue) return new Error('error parsing query options');

    query = _evalQueryValue(rawQueryValue, options.evalContext);
    queryOptions = _evalQueryValue(rawOptionsValue, options.evalContext);

    if (_.isError(query)) return new Error('error evaluating query');
    if (_.isError(queryOptions)) return new Error('error evaluating query');
  }

  return {
    query: query,
    queryOptions: queryOptions
  };
}

/**
 * @method evalQueryValue - evaluates a JS expression from the Mongotron code editor
 * @private
 *
 * @param {String} raw value from editor
 */
function _evalQueryValue(rawValue, evalContext) {
  evalContext = evalContext || {};
  evalContext.ObjectId = ObjectId;

  var queryValue;

  try {
    queryValue = eval.call(evalContext, '(' + rawValue + ')'); // jshint ignore:line
  } catch (err) {
    queryValue = err;
  }

  return queryValue;
}

module.exports = Query;
