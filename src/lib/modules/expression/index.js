'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const evaluator = require('lib/modules/evaluator');
const keyValueUtils = require('src/lib/utils/keyValueUtils');

class Expression {
  eval(expression, collections) {
    return new Promise((resolve, reject) => {
      if (!expression) return reject(new Error('Expression - eval() - expression is required'));
      if (!collections) return reject(new Error('Expression - eval() - collections is required'));

      let evalScope = {
        db: {}
      };

      collections.forEach(collection => {
        evalScope.db[collection.name] = collection;
      });

      let startTime = process.hrtime();

      evaluator.eval(expression, evalScope)
        .then((result) => {
          result.time = _getTime(startTime);

          let expressionResult = {
            result: result
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

function _getTime(startTime) {
  let endTime = process.hrtime(startTime);
  return endTime[0], endTime[1] / 1000000;
}

module.exports = new Expression();
