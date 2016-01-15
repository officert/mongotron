'use strict';

const AbstractError = require('./abstractError');

/** @class */
class ConnectionError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Connection Error';
  }
}

module.exports = ConnectionError;
