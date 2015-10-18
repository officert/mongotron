'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');

var Connection;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  Connection = require('lib/connection');
});

afterEach(function() {
  sandbox.restore();
});

describe('connection', function() {
  describe('constructor', function() {
    describe('when no options are passed', function() {
      var connection;

      beforeEach(function() {
        connection = new Connection();
      });

      it('should default the name to \'local\'', function() {
        connection.name.should.equal('local');
      });

      it('should default the host to \'localhost\'', function() {
        connection.host.should.equal('localhost');
      });

      it('should default the port to \'27017\'', function() {
        connection.port.should.equal(27017);
      });
    });
  });
});
