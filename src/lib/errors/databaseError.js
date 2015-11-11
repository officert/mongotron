/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor DatabaseError
 */
var DatabaseError = function() {
  AbstractError.apply(this, arguments);
};
util.inherits(DatabaseError, AbstractError);
DatabaseError.prototype.name = 'Database Error';

/*
 * @exports
 *
 */
module.exports = DatabaseError;
