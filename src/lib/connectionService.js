'use strict';

/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('underscore');
const async = require('async');

var Connection = require('./connection');

const DB_CONNECTIONS = path.join(__dirname, '../config/dbConnections.json');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor ConnectionService
 */
class ConnectionService {
  constructor() {
    this._connections = []; //cache of Connection instances
  }

  /**
   * @method list
   */
  list(next) {
    next = next || function() {};

    var _this = this;

    return next(null, _this._connections);
  }

  /**
   * @method initializeConnections
   */
  initializeConnections(next) {
    next = next || function() {};

    var _this = this;

    async.waterfall([
      function getDbConfigsStep(done) {
        jsonfile.readFile(DB_CONNECTIONS, done);
      },
      function createConnectionsStep(fileData, done) {
        _generateConnectionInstancesFromConfig(fileData, done);
      }
    ], function(err, connections) {
      if (err) return next(err);

      _this._connections = _this._connections.concat(connections);

      return next(null, _this._connections);
    });
  }
}

/* ------------------------------------------------
 * Private Helpers
 * ------------------------------------------------ */
function _generateConnectionInstancesFromConfig(configData, next) {
  var connections = [];

  //add the connection name
  for (var key1 in configData) {
    var connectionConfig = configData[key1];
    connectionConfig.name = key1;
  }

  var serverConfigGroups = _.groupBy(configData, function(c) {
    return [c.name, c.host, c.port].join('_');
  });

  for (var key2 in serverConfigGroups) {
    var databaseConfigs = serverConfigGroups[key2];

    if (!databaseConfigs || !databaseConfigs.length) continue;

    var connection = _createConnection(databaseConfigs);

    connections.push(connection);
  }

  return next(null, connections);
}

function _createConnection(databaseConfigs) {
  var firstConfig = databaseConfigs[0];

  var connection = new Connection({
    name: firstConfig.name,
    host: firstConfig.host,
    port: firstConfig.port,
    databaseConfigs: databaseConfigs
  });

  return connection;
}

/*
 * @exports
 *
 */
module.exports = new ConnectionService();
