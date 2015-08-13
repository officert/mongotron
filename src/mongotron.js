/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
var ConnectionService = require('lib/connectionService');

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
