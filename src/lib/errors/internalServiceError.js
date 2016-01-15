'use strict';

const AbstractError = require('./abstractError');

/** @class */
class InternalServiceError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Internal Service Error';
  }
}

module.exports = InternalServiceError;
