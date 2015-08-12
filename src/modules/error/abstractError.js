/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

/*
 * @constructor AbstractError
 */
var AbstractError = function(errorType, constr) {
  Error.captureStackTrace(this, constr || this);

  var isMessage = (typeof errorType === 'string');
  this.message = isMessage ? errorType : errorType.message;
};
util.inherits(AbstractError, Error);

AbstractError.prototype.name = 'Abstract Error';

AbstractError.prototype.toString = function() {
  return String(this.message);
};

AbstractError.prototype.getMessage = function() {
  return this.message;
};

AbstractError.prototype.getCode = function() {
  return this.code;
};

/*
 * @exports
 *
 */
module.exports = AbstractError;
