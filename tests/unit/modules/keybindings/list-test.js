'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

let keybindings;
let sandbox;
let fileUtils;

before(() => {
  sandbox = sinon.sandbox.create();

  keybindings = require('lib/modules/keybindings');
  fileUtils = require('lib/utils/fileUtils');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('keybindings', () => {
    describe('list', () => {
      describe('keybindings config file', () => {
        describe('when there is an error reading the keybindings file', () => {
          let error = new Error('Error reading file');

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .rejects(error);
          });

          it('should reject with an error', next => {
            keybindings.list()
              .catch(err => {
                should.exist(err);
                err.should.equal(error);
                return next(null);
              });
          });
        });

        describe('when file data is not an array', () => {
          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .resolves('12345');
          });

          it('should reject with an error', next => {
            keybindings.list()
              .catch(error => {
                should.exist(error);
                error.message.should.equal('keybindings - list() - error parsing keybindings file data');
                return next(null);
              });
          });
        });

        describe('no issues', () => {
          let actualKeybindings = [{
            foo: 'bar'
          }];

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .resolves(actualKeybindings);
          });

          it('should return an array of keybindings', next => {
            keybindings.list()
              .then(bindings => {
                should.exist(bindings);
                return next(null);
              });
          });
        });
      });
    });
  });
});
