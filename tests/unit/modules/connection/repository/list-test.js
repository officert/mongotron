'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

let connectionRepository;
let sandbox;
let fileUtils;

before(() => {
  sandbox = sinon.sandbox.create();

  connectionRepository = require('lib/modules/connection/repository');
  fileUtils = require('lib/utils/fileUtils');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('connection', () => {
    describe('repository', () => {
      describe('list', () => {
        describe('dbConnections config file', () => {
          describe('if there is an error reading the config file contain mongo connnections', () => {
            let error = new Error('Error reading file');

            before(() => {
              sandbox.stub(fileUtils, 'readJsonFile')
                .rejects(error);
            });

            it('should return an error', next => {
              connectionRepository.list()
                .catch(err => {
                  should.exist(err);
                  error.should.equal(err);
                  return next(null);
                });
            });
          });
        });

        describe('no issues', () => {
          let connections = [{
            foo: 'bar'
          }];

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .resolves(connections);
          });

          it('should return an array of connections', next => {
            connectionRepository.list()
              .then(connections => {
                should.exist(connections);
                connections.should.equal(connections);
                return next(null);
              });
          });
        });
      });
    });
  });
});
