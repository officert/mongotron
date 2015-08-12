/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
var ConnectionService = require('modules/connection');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor Mongotron
 */
function Mongotron() {}

Mongotron.prototype.init = function init(next) {
  ConnectionService.initializeConnections(next);
};

/*
 * @exports
 *
 */
module.exports = new Mongotron();
