'use strict';

const _ = require('underscore');
const vm = require('vm');

class Evalutor {
  /**
   * @method eval - evaluate a JS expression
   *
   * @param {String} expression
   * @param {Object} scope
   *
   */
  eval(expression, scope) {
    if (!expression || !_.isString(expression)) return;

    var evalScope = {};

    if (scope && _.isObject(scope)) {
      _.extend(evalScope, scope);
    }

    var options = {
      displayErrors: false
    };

    // Evalutate the expression with the given scope
    // var stringScript = expression.replace(/^\#\!.*/, '');

    var script = new vm.Script(expression, options);

    var result;

    try {
      result = script.runInNewContext(evalScope, options);
    } catch (err) {
      result = err;
    }

    return result;
  }
}

module.exports = new Evalutor();
