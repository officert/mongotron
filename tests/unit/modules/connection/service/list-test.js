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
      describe('list', function() {
        describe('when called', function() {
          var connectionRepositoryListStub;

          before(function() {
            connectionRepositoryListStub = sandbox.stub(connectionRepository, 'list')
              .resolves({});
          });

          it('should call connectionRepository.list', function(next) {
            connectionService.list()
              .then(function(result) {

                should.exist(result);

                connectionRepositoryListStub.calledOnce.should.equal(true);

                return next(null);
              });
          });
        });
      });
    });
  });
});
