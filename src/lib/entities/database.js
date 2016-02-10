'use strict';

const MongoDb = require('mongodb').Db;
const MongoServer = require('mongodb').Server;
const Promise = require('bluebird');
const _ = require('underscore');

const Collection = require('lib/entities/collection');
const errors = require('lib/errors');
const mongoUtils = require('src/lib/utils/mongoUtils');

/** @class */
class Database {
  /** @constructor */
  /**
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

    this.id = options.id;
    this.name = options.name; //TODO: validate name doesn't contain spaces
    this.host = options.host;
    this.port = options.port;
    this.auth = options.auth;
    this.connection = options.connection;

    this.collections = [];

    if (mongoUtils.isLocalHost(this.host)) {
      this._dbConnection = new MongoDb(this.name, new MongoServer(this.host, this.port));
    } else {
      this._dbConnection = null; //this is set by the parent connection once we've connect to it
    }
  }

  /** @method */
  /**
   * @return Promise
   */
  open() {
    return new Promise((resolve, reject) => {
      //TODO: need to do some research and see if connecting to a database
      //over and over like this is a performance issue or causes memory leaks
      if (mongoUtils.isLocalHost(this.host)) {
        this._dbConnection.open((err) => {
          if (err) return reject(new errors.DatabaseError(err.message));

          return resolve(null);
        });
      } else {
        this.connection.connect()
          .then((database) => {
            if (!database) {
              return reject(new Error('error connecting to database'));
            } else {
              this._dbConnection = database;
            }
            return resolve(null);
          })
          .catch((err) => {
            if (err) return reject(new errors.DatabaseError(err.message));
          });
      }
    });
  }

  /** @method */
  /**
   * @return Promise
   */
  listCollections() {
    return new Promise((resolve, reject) => {
      if (!this._dbConnection) return reject(new Error('database - listCollections() - database is not connected yet'));

      this._dbConnection.collections((err, collections) => {
        if (err) return reject(new errors.DatabaseError(err.message));

        _.each(collections, (collection) => {
          this.addCollection({
            name: collection.collectionName
          });
        });

        return resolve(this.collections);
      });
    });
  }

  /** @method */
  /**
   * @return Promise
   */
  addCollection(options) {
    return new Promise((resolve, reject) => {
      if (!options) return reject(new Error('database - addCollection() - options is required'));
      if (!options.name) return reject(new Error('database - addCollection() - options.name is required'));

      if (!this._dbConnection) return reject(new Error('database - addCollection() - database is not connected yet'));

      let existingCollection = _.findWhere(this.collections, {
        name: options.name
      });

      if (existingCollection) return reject(new Error(`database -addCollection() - the collection name ${options.name} is already used`));

      options.serverName = `${this.host}:${this.port}`;
      options.databaseName = this.name;
      options.connection = this.connection;
      options.database = this;

      this._dbConnection.createCollection(options.name, (err) => {
        if (err) return reject(err);

        let collection = new Collection(this._dbConnection, options);

        this.collections.push(collection);

        return resolve(collection);
      });
    });
  }

  /**
   * Drop the database
   */
  drop() {
    return new Promise((resolve, reject) => {
      this._dbConnection.dropDatabase(err => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}

module.exports = Database;
