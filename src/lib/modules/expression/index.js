'use strict';

const Promise = require('bluebird');
const _ = require('underscore');
const esprima = require('esprima');
const vm = require('vm');
const ObjectId = require('mongodb').ObjectId;

const keyValueUtils = require('src/lib/utils/keyValueUtils');

class Expression {
  /**
   * evaluate a JS expression
   * @param {String} expression
   * @param {Array<Collection>} [collections]
   * @returns Promise
   */
  eval(expression, collections) {
    return new Promise((resolve, reject) => {
      if (!expression) return reject(new Error('Expression - eval() - expression is required'));
      if (!collections || !_.isArray(collections)) return reject(new Error('Expression - eval() - collections is required'));

      let astTokens = esprima.tokenize(expression);

      let evalScope = _createEvalScope(collections);

      let startTime = process.hrtime();

      _eval(expression, evalScope)
        .then((result) => {
          let time = _getTime(startTime);

          let expressionResult = {
            result: result,
            time: time,
            mongoMethodName: _getMongoMethodName(astTokens),
            mongoCollectionName: _getMongoCollectionName(astTokens)
          };

          if (_.isArray(expressionResult.result)) {
            expressionResult.keyValueResults = keyValueUtils.convert(expressionResult.result);
          }

          return resolve(expressionResult);
        })
        .catch(reject);
    });
  }

  getMongoMethodName(expression) {
    let astTokens = esprima.tokenize(expression);
    return _getMongoMethodName(astTokens);
  }

  getMongoCollectionName(expression) {
    let astTokens = esprima.tokenize(expression);
    return _getMongoCollectionName(astTokens);
  }

  getMongoQuery(expression) {
    let astTokens = esprima.tokenize(expression);
    return _getMongoQuery(astTokens);
  }
}

function _createEvalScope(collections) {
  let evalScope = {
    db: {}
  };

  collections.forEach(collection => {
    evalScope.db[collection.name] = collection;
  });

  return evalScope;
}

function _getMongoMethodName(astTokens) {
  //TODO: need to handle the case of 'db[Cars].find'
  if (!astTokens || astTokens.length < 4) return null;
  if (astTokens[0].value !== 'db') return null;
  return astTokens[4].value;
}

function _getMongoCollectionName(astTokens) {
  //TODO: need to handle the case of 'db[Cars].find'
  if (!astTokens || astTokens.length < 2) return null;
  if (astTokens[0].value !== 'db') return null;
  return astTokens[2].value;
}

function _getMongoQuery() {
  //TODO: need to handle the case of 'db[Cars].find'
  // if (!astTokens || astTokens.length < 2) return null;
  // if (astTokens[0].value !== 'db') return null;
  // return astTokens[2].value;
  return null;
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
      ObjectId: ObjectId
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

    if (_isPromise(result)) {
      result.then(promiseResult => {
        return resolve(promiseResult);
      });

      if (result.catch) result.catch(reject);
    } else {
      return resolve(result);
    }
  });
}

function _isPromise(func) {
  return func && func.then && typeof(func.then) === 'function';
}

module.exports = new Expression();
