/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const util = require('util');

const errors = require('./errors');

/* ------------------------------------------------
 * Constructor
 * ------------------------------------------------ */
/* @constructor Database
 */
function Database(options) {
  options = options || {};

  var _this = this;
  _this.name = options.name || 'test';
  _this.host = options.host || 'localhost';
  _this.port = options.port || 27017;
  _this.auth = options.auth || null;

  _this.isOpen = false;

  _this.collections = [];

  _this._dbConnection = new MongoDb(_this.name, new MongoServer(_this.host, _this.port));
}

Database.prototype.open = function open(next) {
  var _this = this;

  _this._dbConnection.open(function(err) {
    if (err) return next(new errors.DatabaseError(err));

    if (_this.auth) {
      _this._dbConnection.authenticate(_this.auth.username, _this.auth.password, function(err) {
        if (err) return next(new errors.DatabaseError(err));

        return next(null);
      });
    } else {
      return next(null);
    }
  });
};

Database.prototype.listCollections = function listCollections(next) {

  var _this = this;

  if (!_this.open) return next(new Error('Database is not open'));

  if (_this.collections && _this.collections.length) {
    return next(null, _this.collections);
  }

  _this._dbConnection.collections(function(err, collections) {
    if (err) return next(new errors.DatabaseError(err));

    _this.collections = collections;

    return next(null, _this.collections);
  });
};

/*
 * @exports
 *
 */
module.exports = Database;
