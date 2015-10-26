'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var connectionService;
var connectionRepository;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  connectionService = require('lib/modules/connection');
  connectionRepository = require('lib/modules/connection/repository');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('create', function() {
      describe('when no name is passed', function() {
        var errorMsg = 'options.name is required';

        it('should return an error', function(next) {
          connectionService.create({
              name: null
            })
            .catch(function(err) {
              should.exist(err);
              err.message.should.equal(errorMsg);
              return next(null);
            });
        });
      });

      describe('when no name is passed', function() {
        var errorMsg = 'options.databaseName is required';

        it('should return an error', function(next) {
          connectionService.create({
              name: '123',
              databaseName: null
            })
            .catch(function(err) {
              should.exist(err);
              err.message.should.equal(errorMsg);
              return next(null);
            });
        });
      });

      describe('when no host is passed', function() {
        var errorMsg = 'options.host is required';

        it('should return an error', function(next) {
          connectionService.create({
              name: '123',
              databaseName: 'foobar',
              host: null
            })
            .catch(function(err) {
              should.exist(err);
              err.message.should.equal(errorMsg);
              return next(null);
            });
        });
      });

      describe('when no port is passed', function() {
        var errorMsg = 'options.port is required';

        it('should return an error', function(next) {
          connectionService.create({
              name: '123',
              databaseName: 'foobar',
              host: 'localhost',
              port: null
            })
            .catch(function(err) {
              should.exist(err);
              err.message.should.equal(errorMsg);
              return next(null);
            });
        });
      });

      describe('all required data is passed', function() {
        var connectionRepositoryCreateStub;

        before(function() {
          connectionRepositoryCreateStub = sandbox.stub(connectionRepository, 'create')
            .resolves({});
        });

        it('should call repository create', function(next) {
          connectionService.create({
              name: '123',
              databaseName: 'foobar',
              host: 'localhost',
              port: 27017
            })
            .then(function(newConnection) {
              should.exist(newConnection);

              connectionRepositoryCreateStub.calledOnce.should.equal(true);

              return next(null);
            });
        });
      });
    });
  });
});
