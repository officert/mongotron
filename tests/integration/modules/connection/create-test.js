'use strict';

require('tests/integration/before-all');

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
              err.message.should.equal('data.host is required');
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
              err.message.should.equal('data.port is required');
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
              err.message.should.equal('data.replicaSet.name is required');
              return next(null);
            });
        });
      });

      describe('when replica set is passed with no servers', () => {
        it('should return an error', (next) => {
          connectionService.create({
              name: '123',
              databaseName: 'foobar',
              replicaSet: {
                name: 'Replica Set 1',
                servers: null
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.servers is required');
              return next(null);
            });
        });
      });

      describe('when replica set is passed with empty servers', () => {
        it('should return an error', (next) => {
          connectionService.create({
              name: '123',
              databaseName: 'foobar',
              replicaSet: {
                name: 'Replica Set 1',
                servers: []
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.servers is required');
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
                servers: [{
                  host: null
                }]
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.servers[0].host is required');
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
                servers: [{
                  host: 'foobar',
                  port: null
                }]
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.servers[0].port is required');
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
                servers: [{
                  host: 'foobar',
                  port: 999999
                }]
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.servers[0].port number must be between 0 and 65535.');
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

      describe('when auth is passed but no username is passed', () => {
        it('should return an error', (next) => {
          connectionService.create({
              name: '123',
              host: 'foobar',
              port: 12345,
              databaseName: 'FOOBAR',
              auth: {
                username: null
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('auth.username is required');
            })
            .done(next);
        });
      });

      describe('when auth is passed but no password is passed', () => {
        it('should return an error', (next) => {
          connectionService.create({
              name: '123',
              host: 'foobar',
              port: 12345,
              databaseName: 'FOOBAR',
              auth: {
                username: 'FOOBAR',
                password: null
              }
            })
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('auth.password is required');
            })
            .done(next);
        });
      });

      describe('when all required data is passed', () => {
        describe('and has authentication and is localhost', () => {
          let newConnectionData = {
            name: '123',
            host: 'localhost',
            port: 27017,
            auth: {
              username: 'username',
              password: 'password'
            }
          };
          let newConnection;

          after((done) => {
            connectionService.delete(newConnection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should save and return the new connection and ignore the auth', (next) => {
            connectionService.create(newConnectionData)
              .then((_newConnection) => {
                newConnection = _newConnection;

                should.exist(newConnection);

                newConnection.name.should.equal(newConnectionData.name);
                newConnection.host.should.equal(newConnectionData.host);
                newConnection.port.should.equal(newConnectionData.port);
                should.not.exist(newConnection.auth);
                should.exist(newConnection.databases);
                newConnection.databases.length.should.equal(0);

                return next(null);
              });
          });
        });

        describe('and has authentication and is not localhost', () => {
          let newConnectionData = {
            name: '123',
            databaseName: 'foobar',
            host: 'foobar.com',
            port: 27017,
            auth: {
              username: 'username',
              password: 'password'
            }
          };
          let newConnection;

          after((done) => {
            connectionService.delete(newConnection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should save and return the new connection and save the auth', (next) => {
            connectionService.create(newConnectionData)
              .then((_newConnection) => {
                newConnection = _newConnection;

                should.exist(newConnection);

                newConnection.name.should.equal(newConnectionData.name);
                newConnection.host.should.equal(newConnectionData.host);
                newConnection.port.should.equal(newConnectionData.port);
                should.exist(newConnection.databases);
                newConnection.databases.length.should.equal(1);
                newConnection.databases[0].name.should.equal(newConnectionData.databaseName);
                should.exist(newConnection.databases[0].auth);
                newConnection.databases[0].auth.username.should.equal(newConnectionData.auth.username);
                newConnection.databases[0].auth.password.should.equal(newConnectionData.auth.password);

                return next(null);
              });
          });
        });

        describe('and host is localhost', () => {
          let newConnectionData = {
            name: '123',
            databaseName: 'foobar',
            host: 'localhost',
            port: 27017
          };
          let newConnection;

          after((done) => {
            connectionService.delete(newConnection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should save and return the new connection', (next) => {
            connectionService.create(newConnectionData)
              .then((_newConnection) => {
                newConnection = _newConnection;

                should.exist(newConnection);

                newConnection.name.should.equal(newConnectionData.name);
                newConnection.host.should.equal(newConnectionData.host);
                newConnection.port.should.equal(newConnectionData.port);
                should.exist(newConnection.databases);
                newConnection.databases.length.should.equal(0);

                return next(null);
              });
          });
        });

        describe('and host is not localhost', () => {
          let newConnectionData = {
            name: '123',
            databaseName: 'foobar',
            host: 'foobar.com',
            port: 27017
          };
          let newConnection;

          after((done) => {
            connectionService.delete(newConnection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should save and return the new connection', (next) => {
            connectionService.create(newConnectionData)
              .then((_newConnection) => {
                newConnection = _newConnection;

                should.exist(newConnection);

                newConnection.name.should.equal(newConnectionData.name);
                newConnection.host.should.equal(newConnectionData.host);
                newConnection.port.should.equal(newConnectionData.port);
                should.exist(newConnection.databases);
                newConnection.databases.length.should.equal(1);
                newConnection.databases[0].name.should.equal(newConnectionData.databaseName);

                return next(null);
              });
          });
        });

        describe('and is a replica set', () => {
          let newConnectionData = {
            name: '123',
            databaseName: 'foobar',
            replicaSet: {
              name: 'Replica Set 1',
              servers: [{
                host: 'Host 1',
                port: 12345
              }, {
                host: 'Host 2',
                port: 65534
              }]
            }
          };
          let newConnection;

          after((done) => {
            connectionService.delete(newConnection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should save and return the new connection', (next) => {
            connectionService.create(newConnectionData)
              .then((_newConnection) => {
                newConnection = _newConnection;

                should.exist(newConnection);

                newConnection.name.should.equal(newConnectionData.name);
                should.not.exist(newConnection.host);
                should.not.exist(newConnection.port);
                should.exist(newConnection.databases);
                should.exist(newConnection.replicaSet);
                newConnection.replicaSet.name.should.equal(newConnectionData.replicaSet.name);
                newConnection.replicaSet.servers.length.should.equal(newConnectionData.replicaSet.servers.length);
                newConnection.replicaSet.servers[0].host.should.equal(newConnectionData.replicaSet.servers[0].host);
                newConnection.replicaSet.servers[0].port.should.equal(newConnectionData.replicaSet.servers[0].port);
                newConnection.replicaSet.servers[1].host.should.equal(newConnectionData.replicaSet.servers[1].host);
                newConnection.replicaSet.servers[1].port.should.equal(newConnectionData.replicaSet.servers[1].port);
                newConnection.databases.length.should.equal(1);
                newConnection.databases[0].name.should.equal(newConnectionData.databaseName);
                should.not.exist(newConnection.databases[0].host);
                should.not.exist(newConnection.databases[0].port);
                should.not.exist(newConnection.databases[0].auth);

                return next(null);
              });
          });
        });
      });
    });
  });
});
