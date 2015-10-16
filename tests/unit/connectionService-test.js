'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const jsonfile = require('jsonfile');

var connectionService;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  connectionService = require('lib/connectionService');
});

afterEach(function() {
  sandbox.restore();
});

describe('connectionService', function() {
  describe('initializeConnections', function() {
    describe('if there is an error reading the config file contain mongo connnections', function() {
      var error = new Error('Error reading file');

      before(function() {
        sandbox.stub(jsonfile, 'readFile', function(dbName, done) {
          return done(error);
        });
      });

      it('should return an error', function(next) {
        connectionService.initializeConnections()
          .catch(function(err) {
            should.exist(err);
            error.should.equal(err);
            return next(null);
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
        connectionService.initializeConnections()
          .then(function(connections) {
            should.exist(connections);
            connections.should.equal(connections);
          }).done(next);
      });
    });
  });
});
