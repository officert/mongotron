'use strict';

/** @class */
class AbstractError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Abstract Error';
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = AbstractError;
