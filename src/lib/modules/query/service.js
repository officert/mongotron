'use strict';

const VALID_QUERY_REGEX = new RegExp(/db.(a-zA-Z1-9)*.*/);
const COLLECTION_FROM_QUERY_REGEX = /(?:db.)([a-zA-Z1-9]*)/; //extracts the collection name from a valid query
const QUERY_TYPE_FROM_QUERY_REGEX = /(?:db.*\.)([a-zA-Z]*)/; //extracts the query type from a valid query

const QUERY_TYPES = require('./queryTypes');

/**
 * @class QueryService
 */
class QueryService {
  isValidQuery(query) {
    return VALID_QUERY_REGEX.test(query);
  }

  getCollectionNameByQuery(query) {
    if (!this.isValidQuery(query)) return;
    var matches = query.match(COLLECTION_FROM_QUERY_REGEX);
    return matches && matches.length <= 2 ? matches[1] : null;
  }

  createQuery(rawQuery) {
    if (!this.isValidQuery(rawQuery)) return;

    var queryTypeName = _getQueryTypeByQuery(rawQuery);

    if (!queryTypeName) return null;

    return _getQueryTypeByName(queryTypeName);
  }
}

function _getQueryTypeByQuery(query) {
  var matches = query.match(QUERY_TYPE_FROM_QUERY_REGEX);
  return matches && matches.length <= 2 ? matches[1] : null;
}

function _getQueryTypeByName(name) {
  var Query = QUERY_TYPES[name];
  if (!Query) return null;
  return new Query();
}

/**
 * @exports
 */
module.exports = new QueryService();
