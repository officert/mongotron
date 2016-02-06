'use strict';

require('tests/integration/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

let Connection;
let sandbox;
let errors;

before(() => {
  sandbox = sinon.sandbox.create();

  Connection = require('lib/entities/connection');

  errors = require('lib/errors');
});

afterEach(() => {
  sandbox.restore();
});

describe('entities', () => {
  describe('database', () => {
    describe('addConnection', () => {
      describe('when no options are passed', () => {
        let connection;
        let database;
        let options = null;

        before(done => {
          connection = new Connection({
            name: 'FOobar Connection',
            host: 'foobar.com',
            port: 2000,
            databaseName: 'Foobar'
          });

          database = connection.databases[0];

          return done(null);
        });

        it('should reject with an error', next => {
          database.addCollection(options)
            .catch(err => {
              should.exist(err);

              err.message.should.equal('database - addCollection() - options is required');

              return next(null);
            });
        });
      });

      describe('when options.name is not passed', () => {
        let connection;
        let database;
        let options = {
          name: null
        };

        before(done => {
          connection = new Connection({
            name: 'FOobar Connection',
            host: 'foobar.com',
            port: 2000,
            databaseName: 'Foobar'
          });

          database = connection.databases[0];

          return done(null);
        });

        it('should reject with an error', next => {
          database.addCollection(options)
            .catch(err => {
              should.exist(err);

              err.message.should.equal('database - addCollection() - options.name is required');

              return next(null);
            });
        });
      });

      describe('when database is not yet connected', () => {
        let connection;
        let database;
        let options = {
          name: 'Foobar'
        };

        before(done => {
          connection = new Connection({
            name: 'FOobar Connection',
            host: 'foobar.com',
            port: 2000,
            databaseName: 'Foobar'
          });

          database = connection.databases[0];

          return done(null);
        });

        it('should reject with an error', next => {
          database.addCollection(options)
            .catch(err => {
              should.exist(err);

              err.message.should.equal('database - addCollection() - database is not connected yet');

              return next(null);
            });
        });
      });

      // describe('when database is connected but options.name is not unique', () => {
      //   let connection;
      //   let database;
      //   let collectionName = 'Collection 1';
      //   let options = {
      //     name: collectionName
      //   };
      //
      //   before(done => {
      //     connection = new Connection({
      //       name: 'FOobar Connection',
      //       host: 'localhost',
      //       port: 27017,
      //       databaseName: 'Foobar'
      //     });
      //
      //     database = connection.databases[0];
      //
      //     database.open()
      //       .then(() => {
      //         database.addCollection({
      //             name: collectionName
      //           })
      //           .then(() => {
      //             return done(null);
      //           })
      //           .catch(err => {
      //             return done(err);
      //           });
      //       })
      //       .catch(err => {
      //         return done(err);
      //       });
      //   });
      //
      //   it('should reject with an error', next => {
      //     database.addCollection(options)
      //       .catch(err => {
      //         should.exist(err);
      //
      //         err.message.should.equal('database - addCollection() - options.name is required');
      //
      //         return next(null);
      //       });
      //   });
      // });
    });
  });
});
