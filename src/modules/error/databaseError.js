/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor DatabaseError
 */
var DatabaseError = function(error) {
  AbstractError.call(this, error ? error.message : error);
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.name = 'Database Error';

/*
 * @exports
 *
 */
module.exports = DatabaseError;
