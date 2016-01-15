'use strict';

const AbstractError = require('./abstractError');

/**
 * @class InternalServiceError
 */
class InternalServiceError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Internal Service Error';
  }
}

/**
 * @exports InternalServiceError
 */
module.exports = InternalServiceError;
