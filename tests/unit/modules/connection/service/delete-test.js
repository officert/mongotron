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
    describe('service', function() {
      describe('delete', function() {
        describe('when called', function() {
          var connectionRepositoryDeleteStub;

          before(function() {
            connectionRepositoryDeleteStub = sandbox.stub(connectionRepository, 'delete')
              .resolves({});
          });

          it('should call connectionRepository.delete', function(next) {
            connectionService.delete(123)
              .then(function(result) {

                should.exist(result);

                connectionRepositoryDeleteStub.calledOnce.should.equal(true);

                return next(null);
              });
          });
        });
      });
    });
  });
});
