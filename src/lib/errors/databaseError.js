'use strict';

const AbstractError = require('./abstractError');

/** @class */
class DatabaseError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Database Error';
  }
}

module.exports = DatabaseError;
