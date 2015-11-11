/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
//errors
const AbstractError = require('./abstractError');
const ConnectionError = require('./connectionError');
const DatabaseError = require('./databaseError');
const InvalidArugmentError = require('./invalidArgumentError');
const InternalServiceError = require('./internalServiceError');
const ObjectNotFoundError = require('./objectNotFoundError');

/*
 * @exports
 *
 */
module.exports = {
  AbstractError: AbstractError,
  ConnectionError: ConnectionError,
  DatabaseError: DatabaseError,
  InvalidArugmentError: InvalidArugmentError,
  InternalServiceError: InternalServiceError,
  ObjectNotFoundError: ObjectNotFoundError
};
