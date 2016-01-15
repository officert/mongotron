'use strict';

const AbstractError = require('./abstractError');

/** @class */
class InvalidArugmentError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Invalid Argument Error';
  }
}

module.exports = InvalidArugmentError;
