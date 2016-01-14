'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const Promise = require('bluebird');

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
    _this.name = options.name; //TODO: validate name doesn't contain spaces
    _this.host = options.host;
    _this.port = options.port;
    _this.auth = options.auth;
    _this.connection = options.connection;

    _this.isOpen = false;

    _this.collections = [];

    if (_this.host === 'localhost') {
      _this._dbConnection = new MongoDb(_this.name, new MongoServer(_this.host, _this.port));
    } else {
      _this._dbConnection = null; //this is set by the parent connection once we've connect to it
    }
  }

  /**
   * @method open
   * @param {Function} next - callback function
   */
  open() {
    var _this = this;

    return new Promise((resolve, reject) => {
      //TODO: need to do some research and see if connecting to a database
      //over and over like this is a performance issue or causes memory leaks
      if (_this.host === 'localhost') {
        _this._dbConnection.open((err) => {
          if (err) return reject(new errors.DatabaseError(err.message));

          return resolve(null);
        });
      } else {
        _this.connection.connect()
          .then((database) => {
            if (!database) {
              return reject(new Error('error connecting to database'));
            } else {
              _this._dbConnection = database;
            }
            return resolve(null);
          })
          .catch((err) => {
            if (err) return reject(new errors.DatabaseError(err.message));
          });
      }
    });
  }

  /**
   * @method listCollections
   */
  listCollections() {
    var _this = this;

    return new Promise((resolve, reject) => {
      if (!_this.open) return reject(new Error('Database is not open'));

      if (_this.collections && _this.collections.length) {
        return resolve(_this.collections);
      }

      _this._dbConnection.collections((err, collections) => {
        if (err) return reject(new errors.DatabaseError(err.message));

        _.each(collections, (collection) => {
          _this.addCollection({
            name: collection.collectionName
          });
        });

        return resolve(_this.collections);
      });
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
 * @exports Database
 */
module.exports = Database;
