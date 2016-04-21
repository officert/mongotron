'use strict';

const Promise = require('bluebird');
const _ = require('underscore');
const esprima = require('esprima');
const vm = require('vm');
const ObjectId = require('mongodb').ObjectId;

const mongoUtils = require('src/lib/utils/mongoUtils');
const keyValueUtils = require('src/lib/utils/keyValueUtils');
const typeUtils = require('src/lib/utils/typeUtils');

class Expression {
  /**
   * evaluate a JS expression
   * @param {String} expression
   * @param {Object} [scope] - a customized scope that the expression will be evaluated in
   * @returns Promise
   */
  evaluate(expression, scope) {
    return new Promise((resolve, reject) => {
      if (!expression) return reject(new Error('Expression - eval() - expression is required'));

      let astTokens = esprima.tokenize(expression);

      let startTime = process.hrtime();

      _eval(expression, scope)
        .then(result => {
          let time = _getTime(startTime);

          let expressionResult = {
            result: result,
            time: time,
            mongoMethodName: _getMongoMethodName(astTokens),
            mongoCollectionName: _getMongoCollectionName(expression, astTokens)
          };

          if (_.isArray(expressionResult.result)) {
            expressionResult.keyValueResults = keyValueUtils.convert(expressionResult.result);
          }

          return resolve(expressionResult);
        })
        .catch(reject);
    });
  }

  getMongoCollectionName(expression) {
    if (!expression) return null;

    let errors = this.validate(expression);

    if (errors && errors.length) return null;

    let astTokens = esprima.tokenize(expression);

    return _getMongoCollectionName(expression, astTokens);
  }

  getMongoMethodName(expression) {
    if (!expression) return null;

    let errors = this.validate(expression);

    if (errors && errors.length) return null;

    let astTokens = esprima.tokenize(expression);

    return _getMongoMethodName(astTokens);
  }

  validate(expression) {
    let syntax;
    try {
      syntax = esprima.parse(expression, {
        tolerant: true,
        loc: true
      });
    } catch (e) {
      return null;
    }

    return syntax.errors;
  }
}

function _getMongoCollectionName(expression, astTokens) {
  if (!astTokens || astTokens.length < 3) return null;
  if (astTokens[0].value !== 'db') return null;

  let bracketNotation = mongoUtils.isBracketNotation(expression);

  let value = astTokens[2].value;

  if (bracketNotation) value = _getStringValue(value);

  return value;
}

function _getMongoMethodName(astTokens) {
  if (!astTokens || astTokens.length < 4) return null;
  if (astTokens[0].value !== 'db') return null;

  let bracketNotation = astTokens[3].value === '[';

  let value = astTokens[4].value;

  if (bracketNotation) value = _getStringValue(value);

  return value;
}

function _getTime(startTime) {
  let endTime = process.hrtime(startTime);
  return endTime[0], endTime[1] / 1000000;
}

/**
 * @private
 * @param {String} expression
 * @param {Object} scope
 */
function _eval(expression, scope) {
  return new Promise((resolve, reject) => {
    if (!expression) return reject(new Error('evaluator - eval() - must pass an expression'));
    if (!_.isString(expression)) return reject(new Error('evaluator - eval() - expression must be a string'));

    var evalScope = {
      ObjectId: ObjectId,
      console: _getConsole()
    };

    if (scope && _.isObject(scope)) {
      _.extend(evalScope, scope);
    }

    var options = {
      displayErrors: false
    };

    // Evalutate the expression with the given scope
    var script;
    var result;

    try {
      script = new vm.Script(expression, options);
    } catch (err) {
      return reject(err);
    }

    //NOTE: ast could contain multiple expressions (top level nodes)

    try {
      result = script.runInNewContext(evalScope, options);
    } catch (err) {
      return reject(err);
    }

    if (typeUtils.isPromise(result)) {
      result.then(promiseResult => {
        return resolve(promiseResult);
      });

      if (result.catch) result.catch(reject);
    } else if (typeUtils.isStream(result)) {
      // result.on('end', )
    } else {
      return resolve(result);
    }
  });
}

function _getConsole() {
  let customConsole = {
    log: function() {
      return arguments;
    },
    debug: function() {
      return arguments;
    },
    info: function() {
      return arguments;
    },
    warn: function() {
      return arguments;
    },
    error: function() {
      return arguments;
    }
  };

  return customConsole;
}

function _getStringValue(str) {
  let matches = str.match(/(?:\\?\"|\\?\')(.*?)(?:\\?\"|\\?\')/);
  return matches && matches.length >= 2 ? matches[1] : null;
}

module.exports = new Expression();
