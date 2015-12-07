'use strict';

const VALID_QUERY_REGEX = new RegExp(/db\.(a-zA-Z1-9)*.*/);
const COLLECTION_FROM_QUERY_REGEX = /(?:db\.)([a-zA-Z1-9]*)[.]{0,1}/; //extracts the collection name from a valid query
const FUNCTION_FROM_QUERY_REGEX = /(?:db\.)(?:[a-zA-Z1-9]*)[.]{1}([a-zA-Z1-9]*)/; //extracts the function from a valid query

const EXTRACT_FULL_QUERY_REGEX = /^(?:db).*.(?:[a-zA-Z0-9])\(([^]+)\)/; // https://regex101.com/r/nM7fJ5/7
const EXTRACT_QUERY_AND_OPTIONS_REGEX = /({[^]+})(?:[\s\n\r])*,(?:[\s\n\r])*({[^]+})/; // https://regex101.com/r/nM7fJ5/8

class QueryParser {
  isValidQuery(query) {
    return VALID_QUERY_REGEX.test(query);
  }

  parseCollectionName(query) {
    if (!this.isValidQuery(query)) return;
    var matches = query.match(COLLECTION_FROM_QUERY_REGEX);
    return matches && matches.length <= 2 ? matches[1] : null;
  }

  parseFunction(query) {
    if (!this.isValidQuery(query)) return;
    var matches = query.match(FUNCTION_FROM_QUERY_REGEX);
    return matches && matches.length <= 2 ? matches[1] : null;
  }

  parseQuery(query) {
    if (!this.isValidQuery(query)) return;

    return _parseFullQuery(query);
  }

  parseOptions(query) {
    if (!this.isValidQuery(query)) return;

    var queryAndOptions = _parseQueryAndOptions(query);

    return queryAndOptions ? queryAndOptions.options : null;
  }
}

function _parseFullQuery(rawQuery) {
  var matches = rawQuery.match(EXTRACT_FULL_QUERY_REGEX);
  return matches && matches.length <= 2 ? matches[1] : null;
}

function _parseQueryAndOptions(rawQuery) {
  var fullQuery = _parseFullQuery(rawQuery);

  if (!fullQuery) return null;

  var matches = fullQuery.match(EXTRACT_QUERY_AND_OPTIONS_REGEX);

  if (!matches || !matches.length || matches.length <= 2) return null;

  return {
    query: matches[1],
    options: matches[2]
  };
}

module.exports = new QueryParser();
