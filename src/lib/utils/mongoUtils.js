'use strict';

const esprima = require('esprima');
const ObjectId = require('mongodb').ObjectId;

/** @class */
class MongoUtils {
  isObjectId(id) {
    return id instanceof ObjectId;
  }

  isLocalHost(host) {
    return host === 'localhost' || host === '127.0.0.1';
  }

  isBracketNotation(expression) {
    let astTokens = esprima.tokenize(expression);

    if (!astTokens || astTokens.length < 3) return false;
    if (astTokens[0].value !== 'db') return false;

    let bracketNotation = astTokens[1].value === '[';

    return bracketNotation;
  }
}

module.exports = new MongoUtils();
