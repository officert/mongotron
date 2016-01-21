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
      describe('update', function() {
        describe('when no id is passed in', function() {
          var id = null;

          it('should return an error', function(next) {
            connectionRepository.update(id)
              .catch(function(err) {
                should.exist(err);

                err.name.should.equal('Invalid Argument Error');

                err.message.should.equal('id is required');

              })
              .done(next);
          });
        });
        describe('when no options are passed in', function() {
          var id = 12345;
          var options = null;

          it('should return an error', function(next) {
            connectionRepository.update(id, options)
              .catch(function(err) {
                should.exist(err);

                err.name.should.equal('Invalid Argument Error');

                err.message.should.equal('updatedConnection is required');

              })
              .done(next);
          });
        });

        describe('when no connection found for id', function() {
          var id = 123;
          var options = {
            name: 'new name'
          };

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          it('should return an error', function(next) {
            connectionRepository.update(id, options)
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
          var options = {
            name: 'new name'
          };
          var jsonWriteFileStub;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([{
                id: id,
                name: 'FOOBAR'
              }]);

            jsonWriteFileStub = sandbox.stub(jsonfile, 'writeFile', function(arg1, arg2, done) {
              return done();
            });
          });

          it('should update the connection', function(next) {
            connectionRepository.update(id, options)
              .then(function(updatedConnection) {

                should.exist(updatedConnection);

                updatedConnection.name.should.equal(options.name);

              })
              .catch(next)
              .done(next);
          });
        });

      });
    });
  });
});
