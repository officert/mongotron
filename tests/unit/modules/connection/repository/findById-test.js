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
      describe('findById', function() {
        describe('when no id is passed in', function() {
          var id = null;

          it('should return an error', function(next) {
            connectionRepository.findById(id)
              .catch(function(err) {
                should.exist(err);

                (err instanceof errors.InvalidArugmentError).should.equal(true);

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
            connectionRepository.findById(id)
              .catch(function(err) {
                should.exist(err);

                (err instanceof errors.ObjectNotFoundError).should.equal(true);

                err.message.should.equal('Connection not found');

              })
              .done(next);
          });
        });

        describe('when connection is found', function() {
          var id = 12345;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([{
                id: id
              }]);
          });

          it('should return the connection', function(next) {
            connectionRepository.findById(id)
              .then(function(connection) {

                should.exist(connection);

                connection.id.should.equal(id);
              })
              .catch(next)
              .done(next);
          });
        });

      });
    });
  });
});
