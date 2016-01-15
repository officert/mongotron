'use strict';

/**
 * @class AbstractError
 */
class AbstractError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Abstract Error';
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

/**
 * @exports AbstractError
 */
module.exports = AbstractError;
