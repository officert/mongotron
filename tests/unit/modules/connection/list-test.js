'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const jsonfile = require('jsonfile');

var connectionModule;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  connectionModule = require('lib/modules/connection');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('list', function() {
      describe('dbConnections config file', function() {
        describe('if there is an error reading the config file contain mongo connnections', function() {
          var error = new Error('Error reading file');

          before(function() {
            sandbox.stub(jsonfile, 'readFile', function(dbName, done) {
              return done(error);
            });
          });

          it('should return an error', function(next) {
            connectionModule.list()
              .catch(function(err) {
                should.exist(err);
                error.should.equal(err);
                return next(null);
              });
          });
        });
      });

      describe('no issues', function() {
        var connections = [{
          foo: 'bar'
        }];

        before(function() {
          sandbox.stub(jsonfile, 'readFile', function(dbName, done) {
            return done(null, connections);
          });
        });

        it('should return an array of connections', function(next) {
          connectionModule.list()
            .then(function(connections) {
              should.exist(connections);
              connections.should.equal(connections);
            }).done(next);
        });
      });
    });
  });
});
