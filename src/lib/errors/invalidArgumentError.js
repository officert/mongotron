/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor DatabaseError
 */
var InvalidArgumentError = function(error) {
  AbstractError.call(this, error ? error.message : error);
};
util.inherits(InvalidArgumentError, AbstractError);
InvalidArgumentError.prototype.name = 'Invalid Argument Error';

/*
 * @exports
 *
 */
module.exports = InvalidArgumentError;
