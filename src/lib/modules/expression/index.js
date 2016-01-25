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
      if (!collections) return reject(new Error('Expression - eval() - collections is required'));

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
}

function _getMongoMethodName(astTokens) {
  if (!astTokens || astTokens.length < 4) return null;
  if (astTokens[0].value !== 'db') return null;
  return astTokens[4].value;
}

function _getMongoCollectionName(astTokens) {
  if (!astTokens || astTokens.length < 2) return null;
  if (astTokens[0].value !== 'db') return null;
  return astTokens[2].value;
}

function _getTime(startTime) {
  let endTime = process.hrtime(startTime);
  return endTime[0], endTime[1] / 1000000;
}

module.exports = new Expression();
