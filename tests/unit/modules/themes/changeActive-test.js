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
    describe('changeActive', () => {
      describe('when no theme name is passed', () => {
        let themeName = null;

        it('should reject with an error', next => {
          themes.changeActive(themeName)
            .catch(err => {
              should.exist(err);
              console.log(err);
              err.message.should.equal('theme - changeActive() - themeName is required');
              return next(null);
            });
        });
      });

      describe('themes config file', () => {
        describe('when there is an error reading the themes file', () => {
          let themeName = 'foobar';
          let error = new Error('Error reading file');

          before(() => {
            sandbox.stub(fileUtils, 'readJsonFile')
              .rejects(error);
          });

          it('should reject with an error', next => {
            themes.changeActive(themeName)
              .catch(err => {
                should.exist(err);
                err.should.equal(error);
                return next(null);
              });
          });
        });
      });

      describe('when theme name is not a valid theme', () => {
        let themeName = 'foobar';

        before(() => {
          sandbox.stub(fileUtils, 'readJsonFile')
            .resolves([]);
        });

        it('should reject with an error', next => {
          themes.changeActive(themeName)
            .catch(err => {
              should.exist(err);
              console.log(err);
              err.message.should.equal(`theme - changeActive() - ${themeName} is not a valid theme`);
              return next(null);
            });
        });
      });

      describe('when theme name is a valid theme', () => {
        let themeName = 'validtheme';
        let actualThemes = [{
          name: themeName,
          active: false
        }, {
          name: 'anothertheme',
          active: false
        }];

        before(() => {
          sandbox.stub(fileUtils, 'readJsonFile')
            .resolves(actualThemes);
        });

        it('should mark the theme as active and return the new active theme', next => {
          themes.changeActive(themeName)
            .then(activeTheme => {
              should.exist(activeTheme);

              should.exist(activeTheme);
              activeTheme.name.should.equal(themeName);
              activeTheme.active.should.equal(true);

              return next(null);
            });
        });
      });
    });
  });
});
