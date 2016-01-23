'use strict';

// const esprima = require('esprima');
// const escodegen = require('escodegen');
const Promise = require('bluebird');
const _ = require('underscore');
const vm = require('vm');
const ObjectId = require('mongodb').ObjectId;

/** @class */
class Evaluator {
  /**
   * evaluate a JS expression
   * @param {String} expression
   * @param {Object} scope
   */
  eval(expression, scope) {
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

      // let astTokens = esprima.tokenize(expression);
      // let ast = esprima.parse(expression);

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

      // let esCodeGenOptions = {
      //   comment: true,
      //   format: {
      //     indent: {
      //       style: '  '
      //     },
      //     quotes: 'auto'
      //   }
      // };

      //
      // //------------------------------
      // // Esprima
      // //------------------------------
      // let ast = esprima.parse(result);
      // let newResult = escodegen.generate(ast, esCodeGenOptions);
      //
      // return newResult;
    });
  }
}

function _isPromise(func) {
  return func && func.then && typeof(func.then) === 'function';
}

/** @exports */
module.exports = new Evaluator();
