/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor InternalServiceError
 */
var InternalServiceError = function() {
  AbstractError.apply(this, arguments);
};
util.inherits(InternalServiceError, AbstractError);
InternalServiceError.prototype.name = 'Internal Service Error';

/*
 * @exports
 *
 */
module.exports = InternalServiceError;
