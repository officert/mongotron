/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
//errors
var AbstractError = require('./abstractError');
var ConnectionError = require('./connectionError');
var DatabaseError = require('./databaseError');
var InvalidArugmentError = require('./invalidArgumentError');

/*
 * @exports
 *
 */
module.exports = {
  AbstractError: AbstractError,
  ConnectionError: ConnectionError,
  DatabaseError: DatabaseError,
  InvalidArugmentError: InvalidArugmentError
};
