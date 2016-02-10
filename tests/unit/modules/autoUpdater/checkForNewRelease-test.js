'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');
const githubApi = require('lib/libs/githubApi');

let autoUpdater;
let appConfig;
let sandbox;

before(() => {
  sandbox = sinon.sandbox.create();

  autoUpdater = require('lib/modules/autoUpdater');

  appConfig = require('src/config/appConfig');
});

afterEach(() => {
  sandbox.restore();
});

describe('modules', () => {
  describe('autoUpdater', () => {
    describe('checkForNewRelease', () => {
      describe('when no releases available', () => {
        let listReleasesStub;

        before(() => {
          listReleasesStub = sandbox.stub(githubApi, 'listReleases')
            .resolves(null);
        });

        it('should resolve with false', next => {
          autoUpdater.checkForNewRelease()
            .then(updateAvailable => {

              should.exist(updateAvailable);
              updateAvailable.should.equal(false);

              listReleasesStub.callCount.should.equal(1);

              return next(null);
            });
        });
      });

      describe('when latest release is same version', () => {
        let listReleasesStub;
        let ogVersion;
        let currentVersion = '1.9.9';
        let latestRelease = {
          tag_name: currentVersion //jshint ignore:line
        };

        before(() => {
          ogVersion = appConfig.version;
          appConfig.version = currentVersion;

          listReleasesStub = sandbox.stub(githubApi, 'listReleases')
            .resolves([latestRelease]);
        });

        after(() => {
          appConfig.version = ogVersion;
        });

        it('should resolve with false', next => {
          autoUpdater.checkForNewRelease()
            .then(updateAvailable => {

              should.exist(updateAvailable);
              updateAvailable.should.equal(false);

              listReleasesStub.callCount.should.equal(1);

              return next(null);
            });
        });
      });

      describe('when latest release is not the same version', () => {
        let listReleasesStub;
        let ogVersion;
        let currentVersion = '1.9.9';
        let latestRelease = {
          tag_name: '2.0.0' //jshint ignore:line
        };

        before(() => {
          ogVersion = appConfig.version;
          appConfig.version = currentVersion;

          listReleasesStub = sandbox.stub(githubApi, 'listReleases')
            .resolves([latestRelease]);
        });

        after(() => {
          appConfig.version = ogVersion;
        });

        it('should resolve with true', next => {
          autoUpdater.checkForNewRelease()
            .then(updateAvailable => {

              should.exist(updateAvailable);
              updateAvailable.should.equal(true);

              listReleasesStub.callCount.should.equal(1);

              return next(null);
            });
        });
      });

      describe('when checkForNewRelease has already been called', () => {
        let listReleasesStub;
        let ogVersion;
        let currentVersion = '1.9.9';
        let latestRelease = {
          tag_name: '2.0.0' //jshint ignore:line
        };

        before(done => {
          ogVersion = appConfig.version;
          appConfig.version = currentVersion;

          listReleasesStub = sandbox.stub(githubApi, 'listReleases')
            .resolves([latestRelease]);

          autoUpdater.checkForNewRelease()
            .then(() => {
              return done(null);
            });
        });

        after(() => {
          appConfig.version = ogVersion;
        });

        it('should resolve with true and not call github and should set the release on the module', next => {
          autoUpdater.checkForNewRelease()
            .then(updateAvailable => {

              should.exist(updateAvailable);
              updateAvailable.should.equal(true);

              listReleasesStub.callCount.should.equal(0);

              let actualLatestRelease = autoUpdater.latestRelease;

              should.exist(actualLatestRelease);
              actualLatestRelease.version.should.equal(latestRelease.tag_name); //jshint ignore:line

              return next(null);
            });
        });
      });
    });
  });
});
