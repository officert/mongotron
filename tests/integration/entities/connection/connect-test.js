'use strict';

require('tests/integration/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var Connection;
var sandbox;
var errors;

before(function() {
  sandbox = sinon.sandbox.create();

  Connection = require('lib/entities/connection');

  errors = require('lib/errors');
});

afterEach(function() {
  sandbox.restore();
});

describe('entities', function() {
  describe('connection', function() {
    describe('connect', function() {
      describe('when host is localhost', function() {
        describe('but port is invalid', function() {
          var connection;

          before(function(done) {
            connection = new Connection({
              name: 'Local Connection',
              host: 'localhost',
              port: 10000
            });

            return done(null);
          });

          it('should return a Connection Error', function(next) {
            connection.connect()
              .catch((err) => {
                should.exist(err);

                console.log('err', err);

                err.name.should.equal('Connection Error');

                err.message.should.equal('connect ECONNREFUSED 127.0.0.1:10000');
              })
              .done(next);
          });
        });

        describe('and port is valid', function() {
          var connection;

          before(function(done) {
            connection = new Connection({
              name: 'Local Connection',
              host: 'localhost',
              port: 27017
            });

            return done(null);
          });

          it('should add databases to collection.databases array', function(done) {
            connection.connect()
              .then((err) => {
                should.not.exist(err);

                should.exist(connection.databases);
                connection.databases.length.should.be.greaterThan(0);

                return done(null);
              });
          });
        });
      });
    });
  });
});
