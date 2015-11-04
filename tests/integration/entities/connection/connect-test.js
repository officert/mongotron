'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');

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

          it('should return a Connection Error', function(done) {
            connection.connect(function(err) {
              should.exist(err);

              (err instanceof errors.ConnectionError).should.equal(true);

              err.message.should.equal('An error occured when trying to connect to localhost');

              return done(null);
            });
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
            connection.connect(function(err) {
              should.not.exist(err);

              should.exist(connection.databases);
              connection.databases.length.should.be.greaterThan(0);

              return done(null);
            });
          });
        });
      });

      describe('when host is not localhost', function() {
        var connection;

        before(function(done) {
          connection = new Connection({
            name: 'Test Connection',
            host: 'foobarhost',
            port: 92833
          });

          return done(null);
        });

        it('should not add nay databases to collection.databases array', function(done) {
          connection.connect(function(err) {
            should.not.exist(err);

            should.exist(connection.databases);
            connection.databases.length.should.equal(0);

            return done(null);
          });
        });
      });
    });
  });
});
