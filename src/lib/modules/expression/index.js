'use strict';

const Promise = require('bluebird');
const _ = require('underscore');
const esprima = require('esprima');

const evaluator = require('lib/modules/evaluator');
const keyValueUtils = require('src/lib/utils/keyValueUtils');

class Expression {
  eval(expression, collections) {
    return new Promise((resolve, reject) => {
      if (!expression) return reject(new Error('Expression - eval() - expression is required'));
      if (!collections || !_.isArray(collections)) return reject(new Error('Expression - eval() - collections is required'));

      let astTokens = esprima.tokenize(expression);

      let evalScope = {
        db: {}
      };

      collections.forEach(collection => {
        evalScope.db[collection.name] = collection;
      });

      let startTime = process.hrtime();

      evaluator.eval(expression, evalScope)
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

module.exports = new Expression();
