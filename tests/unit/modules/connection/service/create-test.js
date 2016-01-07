'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var connectionService;
var connectionRepository;
var sandbox;

before(() => {
  sandbox = sinon.sandbox.create();

  connectionService = require('lib/modules/connection');
  connectionRepository = require('lib/modules/connection/repository');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('connection', () => {
    describe('service', () => {
      describe('create', () => {
        describe('when no name is passed', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: null
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('connection.name is required');
                return next(null);
              });
          });
        });

        describe('when no host is passed', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                host: null
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.host is required');
                return next(null);
              });
          });
        });

        describe('when no port is passed', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                host: 'localhost',
                port: null
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.port is required');
                return next(null);
              });
          });
        });

        describe('when invalid port is passed', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                host: 'localhost',
                port: 99999
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('Port number must be between 0 and 65535.');
                return next(null);
              });
          });
        });

        describe('when replica set is passed with no name', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: null
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.name is required');
                return next(null);
              });
          });
        });

        describe('when replica set is passed with no sets', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: 'Replica Set 1',
                  sets: null
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.sets is required');
                return next(null);
              });
          });
        });

        describe('when replica set is passed with empty sets', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: 'Replica Set 1',
                  sets: []
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.sets is required');
                return next(null);
              });
          });
        });

        describe('when replica set set is passed with no host', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: 'Replica Set 1',
                  sets: [{
                    host: null
                  }]
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.sets[0].host is required');
                return next(null);
              });
          });
        });

        describe('when replica set set is passed with no port', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: 'Replica Set 1',
                  sets: [{
                    host: 'foobar',
                    port: null
                  }]
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.sets[0].port is required');
                return next(null);
              });
          });
        });

        describe('when replica set set is passed with invalid port', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: 'foobar',
                replicaSet: {
                  name: 'Replica Set 1',
                  sets: [{
                    host: 'foobar',
                    port: 999999
                  }]
                }
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('newConnection.replicaSet.sets[0].port number must be between 0 and 65535.');
              })
              .done(next);
          });
        });

        describe('when host is not localhost and no databaseName is passed', () => {
          it('should return an error', (next) => {
            connectionService.create({
                name: '123',
                databaseName: null,
                host: 'foobar',
                port: 12345
              })
              .catch((err) => {
                should.exist(err);
                err.message.should.equal('database is required when connecting to a remote server.');
              })
              .done(next);
          });
        });

        describe('when all required data is passed', () => {
          let connectionRepositoryCreateStub;
          let newConnection = {
            name: '123',
            databaseName: 'foobar',
            host: 'localhost',
            port: 27017
          };

          before(() => {
            connectionRepositoryCreateStub = sandbox.stub(connectionRepository, 'create')
              .resolves({});
          });

          it('should call repository create', (next) => {
            connectionService.create(newConnection)
              .then((newConnection) => {
                should.exist(newConnection);

                connectionRepositoryCreateStub.calledOnce.should.equal(true);

                return next(null);
              });
          });
        });
      });
    });
  });
});
