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

      describe('when port is invalid', () => {
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
      });
    });
  });
});
