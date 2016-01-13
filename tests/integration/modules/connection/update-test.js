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
    describe('update', () => {
      describe('when no id is passed', () => {
        it('should return an error', (next) => {
          let id = null;

          connectionService.update(id)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('id is required');
            })
            .done(next);
        });
      });

      describe('when no updates are passed', () => {
        it('should return an error', (next) => {
          let updates = null;

          connectionService.update('123', updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('updates is required');
            })
            .done(next);
        });
      });

      describe('when connection does not exist for id', () => {
        it('should return an error', (next) => {
          connectionService.update('123', {})
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('Connection not found');
            })
            .done(next);
        });
      });

      describe('when auth.username is updated but no password is passed and existing connection has no password', () => {
        let connection;
        let updates = {
          auth: {
            username: 'Bob Dole'
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'foobar.com',
              port: 12345,
              databaseName: 'db'
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('auth.password is required');
            })
            .done(next);
        });
      });

      describe('when auth.password is updated but no username is passed and existing connection has no username', () => {
        let connection;
        let updates = {
          auth: {
            password: 'somepassword'
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'foobar.com',
              port: 12345,
              databaseName: 'db'
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('auth.username is required');
            })
            .done(next);
        });
      });

      describe('when host is changed to non localhost but no databaseName is passed', () => {
        let connection;
        let updates = {
          host: 'foobar.com'
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'localhost',
              port: 27017
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('database is required when connecting to a remote server.');
            })
            .done(next);
        });
      });

      describe('when port is changed to an invalid port', () => {
        let connection;
        let updates = {
          port: 999999
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'foobar.com',
              port: 12345,
              databaseName: 'db'
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('Port number must be between 0 and 65535.');
            })
            .done(next);
        });
      });

      describe('when replicaSet is passed with no name and existing connection has no replica set', () => {
        let connection;
        let updates = {
          replicaSet: {
            sets: [{
              host: 'host1.com',
              port: 27017
            }]
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'localhost',
              port: 27017
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.name is required');
            })
            .done(next);
        });
      });

      describe('when replicaSet is passed with server with no host', () => {
        let connection;
        let updates = {
          replicaSet: {
            name: 'repl1',
            sets: [{
              port: 27017
            }]
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'localhost',
              port: 27017
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.sets[0].host is required');
            })
            .done(next);
        });
      });

      describe('when replicaSet is passed with server with no port', () => {
        let connection;
        let updates = {
          replicaSet: {
            name: 'repl1',
            sets: [{
              host: 'host1.com'
            }]
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'localhost',
              port: 27017
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              err.message.should.equal('data.replicaSet.sets[0].port is required');
            })
            .done(next);
        });
      });

      describe('when replicaSet is updated but no name is passed and existing connection has no replicaSet', () => {
        let connection;
        let updates = {
          replicaSet: {
            sets: [{
              host: 'foobar',
              port: 21222
            }]
          }
        };

        before((done) => {
          connectionService.create({
              name: 'Connection 1',
              host: 'localhost',
              port: 27017
            })
            .then((newConnection) => {
              connection = newConnection;
              return done(null);
            })
            .catch(done);
        });

        after((done) => {
          connectionService.delete(connection.id)
            .then(() => {
              return done(null);
            })
            .catch(done);
        });

        it('should return an error', (next) => {
          connectionService.update(connection.id, updates)
            .catch((err) => {
              should.exist(err);
              err.message.should.equal('data.replicaSet.name is required');
            })
            .done(next);
        });
      });

      describe('when all required data is passed', () => {
        describe('when name is updated', () => {
          let connection;
          let updates = {
            name: 'Connection New Name'
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'localhost',
                port: 12345
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the name and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.name.should.equal(updates.name);
              })
              .done(next);
          });
        });

        describe('when host is updated to local host', () => {
          let connection;
          let updates = {
            host: 'localhost'
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'newhost.com',
                port: 20102,
                databaseName: 'foobar'
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the host and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.host.should.equal(updates.host);
                should.not.exist(updatedConnection.databases);
              })
              .done(next);
          });
        });

        describe('when host is updated to remote host', () => {
          let connection;
          let updates = {
            host: 'newhost.com',
            databaseName: 'foobar'
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'localhost',
                port: 12345
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the host and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.host.should.equal(updates.host);
                should.exist(updatedConnection.databases);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].host.should.equal(updates.host);
              })
              .done(next);
          });
        });

        describe('when port is updated and host is local host', () => {
          let connection;
          let updates = {
            port: 29877
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'localhost',
                port: 12345
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the port and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.port.should.equal(updates.port);
              })
              .done(next);
          });
        });

        describe('when port is updated and host is remote host', () => {
          let connection;
          let updates = {
            port: 29877,
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'remote1.com',
                port: 12345,
                databaseName: 'foobar'
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the port and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.port.should.equal(updates.port);
                should.exist(updatedConnection.databases);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].port.should.equal(updates.port);
              })
              .done(next);
          });
        });

        describe('when databaseName is updated', () => {
          let connection;
          let updates = {
            databaseName: 'newdbname'
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'remove.com',
                port: 12345,
                databaseName: 'olddbname'
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the database name and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].name.should.equal(updates.databaseName);
              })
              .done(next);
          });
        });

        describe('when auth.username is updated but no password is passed and existing connection has a password', () => {
          let connection;
          let updates = {
            auth: {
              username: 'Bob Dole'
            }
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'foobar.com',
                port: 12345,
                databaseName: 'db',
                auth: {
                  username: 'username',
                  password: 'password'
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the auth.username and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                console.log('in test', updatedConnection.databases[0]);
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].auth.username.should.equal(updates.auth.username);
              })
              .done(next);
          });
        });

        describe('when auth.password is updated but no username is passed and existing connection has a username', () => {
          let connection;
          let updates = {
            auth: {
              password: 'newpassword'
            }
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'foobar.com',
                port: 12345,
                databaseName: 'db',
                auth: {
                  username: 'username',
                  password: 'password'
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the auth.password and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].auth.password.should.equal(updates.auth.password);
              })
              .done(next);
          });
        });

        describe('when auth is removed', () => {
          let connection;
          let updates = {
            auth: null
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'foobar.com',
                port: 12345,
                databaseName: 'db',
                auth: {
                  username: 'username',
                  password: 'password'
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should remove the database auth and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                should.not.exist(updatedConnection.databases[0].auth);
              })
              .done(next);
          });
        });

        describe('when replicaSet is updated and existing connection has no replicaSet', () => {
          let connection;
          let updates = {
            replicaSet: {
              name: 'repl1',
              sets: [{
                host: 'host1',
                port: 27017
              }]
            }
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'foobar.com',
                port: 12345,
                databaseName: 'db',
                auth: {
                  username: 'username',
                  password: 'password'
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should add the replicaSet to the connection and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                should.exist(updatedConnection.replicaSet);
                updatedConnection.replicaSet.name.should.equal(updates.replicaSet.name);
                should.exist(updatedConnection.replicaSet.sets);
                updatedConnection.replicaSet.sets.length.should.equal(1);
                updatedConnection.replicaSet.sets[0].host.should.equal(updates.replicaSet.sets[0].host);
                updatedConnection.replicaSet.sets[0].port.should.equal(updates.replicaSet.sets[0].port);
              })
              .done(next);
          });
        });

        describe('when replicaSet.name is updated and existing connection already has a replicaSet', () => {
          let connection;
          let updates = {
            replicaSet: {
              name: 'new replset name',
            }
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'host1.com',
                port: 27017,
                databaseName: 'db',
                replicaSet: {
                  name: 'repl1',
                  sets: [{
                    host: 'host1.com',
                    port: 27017
                  }]
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the replicaSet.name return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                should.exist(updatedConnection.replicaSet);
                updatedConnection.replicaSet.name.should.equal(updates.replicaSet.name);
              })
              .done(next);
          });
        });

        describe('when replicaSet.sets is updated and existing connection already has a replicaSet', () => {
          let connection;
          let updates = {
            replicaSet: {
              sets: [{
                host: 'new host.com',
                port: 44444
              }]
            }
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'host1.com',
                port: 27017,
                databaseName: 'db',
                replicaSet: {
                  name: 'repl1',
                  sets: [{
                    host: 'host1.com',
                    port: 27017
                  }]
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the replicaSet.sets return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                should.exist(updatedConnection.replicaSet);
                should.exist(updatedConnection.replicaSet.sets);
                updatedConnection.replicaSet.sets[0].host.should.equal(updates.replicaSet.sets[0].host);
                updatedConnection.replicaSet.sets[0].port.should.equal(updates.replicaSet.sets[0].port);
              })
              .done(next);
          });
        });

        describe('when replicaSet is removed', () => {
          let connection;
          let updates = {
            replicaSet: null
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'host1.com',
                port: 27017,
                databaseName: 'db',
                replicaSet: {
                  name: 'repl1',
                  sets: [{
                    host: 'host1.com',
                    port: 27017
                  }]
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should remove the replicaSet return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                should.exist(updatedConnection.databases[0]);
                should.not.exist(updatedConnection.replicaSet);
              })
              .done(next);
          });
        });

        describe('when host is updated and existing connection has a replicaSet', () => {
          let connection;
          let updates = {
            host: 'foobar.com'
          };

          before((done) => {
            connectionService.create({
                name: 'Connection 1',
                host: 'host1.com',
                port: 27017,
                databaseName: 'db',
                replicaSet: {
                  name: 'repl1',
                  sets: [{
                    host: 'host1.com',
                    port: 27017
                  }]
                }
              })
              .then((newConnection) => {
                connection = newConnection;
                return done(null);
              })
              .catch(done);
          });

          after((done) => {
            connectionService.delete(connection.id)
              .then(() => {
                return done(null);
              })
              .catch(done);
          });

          it('should update the host, remove the replicaSet and return the connection', (next) => {
            connectionService.update(connection.id, updates)
              .then((updatedConnection) => {
                should.exist(updatedConnection);
                updatedConnection.host.should.equal(updates.host);
                should.not.exist(updatedConnection.replicaSet);
                should.exist(updatedConnection.databases[0]);
                updatedConnection.databases[0].host.should.equal(updates.host);
              })
              .done(next);
          });
        });
      });
    });
  });
});
