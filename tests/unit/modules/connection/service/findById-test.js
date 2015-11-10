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
      describe('findById', function() {
        describe('when called', function() {
          var connectionRepositoryFindByIdStub;

          before(function() {
            connectionRepositoryFindByIdStub = sandbox.stub(connectionRepository, 'findById')
              .resolves({});
          });

          it('should call connectionRepository.findById', function(next) {
            connectionService.findById(123)
              .then(function(result) {

                should.exist(result);

                connectionRepositoryFindByIdStub.calledOnce.should.equal(true);

                return next(null);
              });
          });
        });
      });
    });
  });
});
