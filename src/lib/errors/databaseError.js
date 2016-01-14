'use strict';

const AbstractError = require('./abstractError');

/**
 * @class DatabaseError
 */
class DatabaseError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Database Error';
  }
}

/**
 * @exports DatabaseError
 */
module.exports = DatabaseError;
