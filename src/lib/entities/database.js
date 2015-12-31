'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;

const Collection = require('lib/entities/collection');
const errors = require('lib/errors');

/**
 * @class Database
 */
class Database {
  /**
   * @constructor Database
   *
   * @param {Object} options
   * @param {String} options.name - name of the database
   * @param {String} options.host - host of the database, defaults to localhost
   * @param {String} options.port - port of the database, defaults to 27017
   * @param {Object} options.auth - database auth info
   * @param {String} options.auth.username - database auth username
   * @param {String} options.auth.password - database auth password
   */
  constructor(options) {
    options = options || {};

    var _this = this;
    _this.id = options.id;
    _this.name = options.name || 'test'; //TODO: validate name doesn't contain spaces
    _this.host = options.host || 'localhost';
    _this.port = options.port || 27017;
    _this.auth = options.auth || null;
    _this.connection = options.connection;

    _this.isOpen = false;

    _this.collections = [];

    _this._dbConnection = new MongoDb(_this.name, new MongoServer(_this.host, _this.port));
  }

  /**
   * @method open
   * @param {Function} next - callback function
   */
  open(next) {
    var _this = this;

    _this._dbConnection.open(function(err) {
      if (err) return next(new errors.DatabaseError(err));

      if (_this.auth && _this.auth.username && _this.auth.password) {
        _this._dbConnection.authenticate(_this.auth.username, _this.auth.password, function(err) {
          if (err) return next(new errors.DatabaseError(err));

          return next(null);
        });
      } else {
        return next(null);
      }
    });
  }

  /**
   * @method listCollections
   * @param {Function} next - callback function
   */
  listCollections(next) {
    var _this = this;

    if (!_this.open) return next(new Error('Database is not open'));

    if (_this.collections && _this.collections.length) {
      return next(null, _this.collections);
    }

    _this._dbConnection.collections(function(err, collections) {
      if (err) return next(new errors.DatabaseError(err));

      _.each(collections, function(collection) {
        _this.addCollection({
          name: collection.collectionName
        });
      });

      return next(null, _this.collections);
    });
  }

  /**
   * @method addCollection
   * @param {Object} options
   */
  addCollection(options) {
    options = options || {};

    var _this = this;

    var existingCollection = _.findWhere(_this.collections, {
      name: options.name
    });

    if (existingCollection) return;

    options.serverName = _this.host + ':' + _this.port;
    options.databaseName = _this.name;
    options.connection = _this.connection;
    options.database = _this;

    var collection = new Collection(_this._dbConnection, options);

    _this.collections.push(collection);

    return collection;
  }

  /**
   * @method drop
   */
  drop() {
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this._dbConnection.dropDatabase(function(err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

}

/**
 * @exports
 */
module.exports = Database;
