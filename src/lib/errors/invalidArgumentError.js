/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor DatabaseError
 */
var InvalidArgumentError = function() {
  AbstractError.apply(this, arguments);
};
util.inherits(InvalidArgumentError, AbstractError);
InvalidArgumentError.prototype.name = 'Invalid Argument Error';

/*
 * @exports
 *
 */
module.exports = InvalidArgumentError;
