'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var connectionRepository;
var connectionService;
var sandbox;

before(function() {
  sandbox = sinon.sandbox.create();

  connectionRepository = require('lib/modules/connection/repository');
  connectionService = require('lib/modules/connection/service');
});

afterEach(function() {
  sandbox.restore();
});

describe('modules', function() {
  describe('connection', function() {
    describe('repository', function() {
      describe('create', function() {
        describe('when nothing is passed in', function() {
          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          it('should return a new connection with undefined properties', function(next) {
            connectionRepository.create({})
              .then((connection) => {
                should.exist(connection);

                connection.should.have.property('id');
                connection.should.have.property('name', undefined);
                connection.should.have.property('host', undefined);
                connection.should.have.property('port', undefined);

              }).done(next);
          });
        });

        describe('when name is passed in', function() {
          let name = 'Connection 1';
          let connection;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should return a new connection with name set', function(next) {
            connectionRepository.create({
                name: name
              })
              .then(function(_connection) {
                connection = _connection;

                should.exist(connection);

                connection.should.have.property('name', name);

              }).done(next);
          });
        });

        describe('when host is passed in', function() {
          let host = 'Connection 1 Host';
          let connection;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should return a new connection with host set', function(next) {
            connectionRepository.create({
                host: host
              })
              .then(function(_connection) {
                connection = _connection;

                should.exist(connection);

                connection.should.have.property('host', host);

              }).done(next);
          });
        });

        describe('when port is passed in', function() {
          let port = 344555;
          let connection;

          before(function() {
            sandbox.stub(connectionRepository, 'list')
              .resolves([]);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should return a new connection with port set', function(next) {
            connectionRepository.create({
                port: port
              })
              .then(function(_connection) {
                connection = _connection;

                should.exist(connection);

                connection.should.have.property('port', port);

              }).done(next);
          });
        });
      });
    });
  });
});
