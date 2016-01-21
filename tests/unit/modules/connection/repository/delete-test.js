'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
const jsonfile = require('jsonfile');
require('sinon-as-promised');

var connectionRepository;
var errors;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  errors = require('lib/errors');

  connectionRepository = require('lib/modules/connection/repository');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('repository', function() {
      describe('delete', function() {
        describe('when no id is passed in', function() {
          var id = null;

          it('should return an error', function(next) {
            connectionRepository.delete(id)
              .catch(function(err) {
                should.exist(err);

                err.name.should.equal('Invalid Argument Error');

                err.message.should.equal('id is required');

              })
              .done(next);
          });
        });

        describe('when no connection found for id', function() {
          var id = 123;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          it('should return an error', function(next) {
            connectionRepository.delete(id)
              .catch(function(err) {
                should.exist(err);

                err.name.should.equal('Object Not Found Error');

                err.message.should.equal('Connection not found');

              })
              .done(next);
          });
        });

        describe('when connection is found', function() {
          var id = 12345;
          var jsonWriteFileStub;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([{
                id: id
              }]);

            jsonWriteFileStub = sandbox.stub(jsonfile, 'writeFile', function(arg1, arg2, done) {
              return done();
            });
          });

          it('should call jsonfile.writeFile with an empty array', function(next) {
            connectionRepository.delete(id)
              .then(function() {

                jsonWriteFileStub.calledOnce.should.equal(true);

              })
              .catch(next)
              .done(next);
          });
        });

      });
    });
  });
});
