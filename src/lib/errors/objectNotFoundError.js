/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor ObjectNotFoundError
 */
 var ObjectNotFoundError = function() {
   AbstractError.apply(this, arguments);
 };
util.inherits(ObjectNotFoundError, AbstractError);
ObjectNotFoundError.prototype.name = 'Object Not Found Error';

/*
 * @exports
 *
 */
module.exports = ObjectNotFoundError;
