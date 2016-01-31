'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

let themes;
let sandbox;
let fileUtils;

before(() => {
  sandbox = sinon.sandbox.create();

  themes = require('lib/modules/themes');
  fileUtils = require('lib/utils/fileUtils');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('themes', () => {
    describe('list', () => {
      describe('themes config file', () => {
        describe('when there is an error reading the themes file', () => {
          let error = new Error('Error reading file');

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .rejects(error);
          });

          it('should reject with an error', next => {
            themes.list()
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
            themes.list()
              .catch(error => {
                should.exist(error);
                error.message.should.equal('themes - list() - error parsing themes file data');
                return next(null);
              });
          });
        });

        describe('no issues', () => {
          let actualThemes = [{
            foo: 'bar'
          }];

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .resolves(actualThemes);
          });

          it('should return an array of themes', next => {
            themes.list()
              .then(_themes => {
                should.exist(_themes);
                return next(null);
              });
          });
        });
      });
    });
  });
});
