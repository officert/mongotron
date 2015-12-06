'use strict';

const util = require('util');

const Promise = require('bluebird');
const ObjectId = require('mongodb').ObjectId;

// const logger = require('lib/modules/logger');
// const QueryResult = require('../queryResult');

const EXTRACT_QUERY_REGEX_PATTERN = '^(?:db).*.(?:%s)\\(([^]+)\\)'; //https://regex101.com/r/nM7fJ5/3
const EXTRACT_OPTIONS_REGEX = /({[^]+})(?:[\s\n\r])*,(?:[\s\n\r])*({[^]+})/;

class BaseQuery {
  constructor() {
    this.rawQuery = null; //the full raw query ex. 'db.users.find({ .... })'
  }

  parse(rawQuery, options) {
    let _this = this;
    options = options || {};

    return new Promise((resolve, reject) => {
      if (!rawQuery) return reject(new Error('baseQuery - parse() : rawQuery is required'));

      let query = _parseRawQuery(rawQuery, {
        methodName: _this.mongoMethod,
        extractOptions: _this.extractOptions,
        evalContext: options.context || {}
      });

      if (!query || !query.query) return reject(new Error('error parsing query'));

      _this.query = query.query;
      _this.queryOptions = query.queryOptions;

      return resolve(_this);
    });
  }
}

function _parseValueFromRawQuery(rawQuery, methodName) {
  let regex = _getRegExpForMethodName(methodName);

  let matches = regex.exec(rawQuery);

  return matches && matches.length > 1 ? matches[1] : null;
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

  let rawQueryValue = _parseValueFromRawQuery(rawQuery, options.methodName);

  if (!rawQueryValue) return null;

  if (!options.extractOptions) {
    let query = _evalQueryValue(rawQueryValue, options.evalContext);

    if (_.isError(query)) return new Error('error parsing query');

    return {
      query: query
    };
  } else {
    let matches = rawQuery.match(EXTRACT_OPTIONS_REGEX);

    if (!matches || !matches.length || matches.length <= 2) return new Error('error parsing query');

    let query = _evalQueryValue(matches[1], options.evalContext);
    let queryOptions = _evalQueryValue(matches[2], options.evalContext);

    if (_.isError(query)) return new Error('error parsing query');
    if (_.isError(queryOptions)) return new Error('error parsing query options');

    return {
      query: query,
      queryOptions: queryOptions
    };
  }
}

function _getRegExpForMethodName(methodName) {
  var regexPattern = util.format(EXTRACT_QUERY_REGEX_PATTERN, methodName);
  return new RegExp(regexPattern);
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

module.exports = BaseQuery;
