/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const util = require('util');

const AbstractError = require('./abstractError');

/*
 * @constructor ConnectionError
 */
var ConnectionError = function() {
  AbstractError.apply(this, arguments);
};
util.inherits(ConnectionError, AbstractError);
ConnectionError.prototype.name = 'Connection Error';

/*
 * @exports
 *
 */
module.exports = ConnectionError;
