'use strict';

const bracketMatcher = require('./bracketMatcher');

const VALID_QUERY_REGEX = new RegExp(/db\.(a-zA-Z1-9_)*.*/);
const COLLECTION_FROM_QUERY_REGEX = /(?:db\.)([a-zA-Z1-9_-]*)[.]{0,1}/; //extracts the collection name from a valid query
const FUNCTION_FROM_QUERY_REGEX = /(?:db\.)(?:[a-zA-Z1-9_-]*)[.]{1}([a-zA-Z1-9]*)/; //extracts the function from a valid query

/** @module Query */
/** @class */
class QueryParser {
  isValidQuery(query) {
    return VALID_QUERY_REGEX.test(query);
  }

  parseCollectionName(query) {
    if (!this.isValidQuery(query)) return null;
    var matches = query.match(COLLECTION_FROM_QUERY_REGEX);
    return matches && matches.length <= 2 ? matches[1] : null;
  }

  parseFunctionName(query) {
    if (!this.isValidQuery(query)) return null;
    var matches = query.match(FUNCTION_FROM_QUERY_REGEX);
    return matches && matches.length <= 2 ? matches[1] : null;
  }

  parseQuery(query) {
    var parts = bracketMatcher.match(query);

    //handle an valid query that is empty (no brackets)
    if (this.isValidQuery(query) && (!parts || !parts.length)) return '{}';

    return (parts && parts.length) ? parts[0] : null;
  }

  parseOptions(query) {
    var parts = bracketMatcher.match(query);

    return (parts && parts.length > 1) ? parts[1] : null;
  }
}

module.exports = new QueryParser();
