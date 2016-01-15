'use strict';

const AbstractError = require('./abstractError');

/**
 * @class InvalidArugmentError
 */
class InvalidArugmentError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Invalid Argument Error';
  }
}

/**
 * @exports InvalidArugmentError
 */
module.exports = InvalidArugmentError;
