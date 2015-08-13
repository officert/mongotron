/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
//errors
var AbstractError = require('./abstractError');
var ConnectionError = require('./connectionError');
var DatabaseError = require('./databaseError');

/*
 * @exports
 *
 */
module.exports = {
  AbstractError: AbstractError,
  ConnectionError: ConnectionError,
  DatabaseError: DatabaseError
};
