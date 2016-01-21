'use strict';

const _ = require('underscore');
const vm = require('vm');

/*
 * Based on https://github.com/pierrec/node-eval/blob/master/eval.js
 * ref : https://nodejs.org/api/vm.html#vm_script_runinnewcontext_sandbox_options
 */
/** @module Query */
/** @class */
class Evaluator {
  /**
   * evaluate a JS expression
   * @param {String} expression
   * @param {Object} scope
   */
  eval(expression, scope) {
    if (!expression) return new Error('evaluator - eval() - must pass an expression');
    if (!_.isString(expression)) return new Error('evaluator - eval() - expression must be a string');

    var evalScope = {};

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
      script = new vm.Script(`(${expression})`, options);
    } catch (err) {
      result = err;
    }

    if (result) return result;

    try {
      result = script.runInNewContext(evalScope, options);
    } catch (err) {
      result = err;
    }

    return result;
  }
}

module.exports = new Evaluator();
