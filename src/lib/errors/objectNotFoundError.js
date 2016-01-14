'use strict';

const AbstractError = require('./abstractError');

/**
 * @class ObjectNotFoundError
 */
class ObjectNotFoundError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Object Not Found Error';
  }
}

/**
 * @exports ObjectNotFoundError
 */
module.exports = ObjectNotFoundError;
