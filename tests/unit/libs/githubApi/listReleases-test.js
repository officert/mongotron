'use strict';

require('tests/unit/before-all');

const should = require('should');
const sinon = require('sinon');
require('sinon-as-promised');

var githubApi;
var sandbox;

before(() => {
  sandbox = sinon.sandbox.create();

  githubApi = require('lib/libs/githubApi');
});

afterEach(() => {
  sandbox.restore();
});

describe('utils', () => {
  describe('githubApi', () => {
    describe('listReleases', () => {
      describe('when no owner is passed', () => {
        it('should reject with an error', next => {
          let owner = null;

          githubApi.listReleases(owner)
            .catch(err => {
              should.exist(err);
              err.message.should.equal('GithubApi - listReleases()- owner is required');
              return next(null);
            });
        });
      });

      describe('when no repository is passed', () => {
        it('should reject with an error', next => {
          let owner = 'foobar';
          let repository = null;

          githubApi.listReleases(owner, repository)
            .catch(err => {
              should.exist(err);
              err.message.should.equal('GithubApi - listReleases()- repository is required');
              return next(null);
            });
        });
      });

      describe('when owner and repository are passed', () => {
        describe('and github api returns with an error', () => {
          let listReleasesStub;
          let errMsg = 'something broke with github :(';

          before(() => {
            listReleasesStub = sandbox.stub(githubApi._api.releases, 'listReleases', (options, callback) => {
              return callback(new Error(errMsg));
            });
          });

          it('should call githubAPi.releases.listReleases() and return a promise', next => {
            let owner = 'foobar';
            let repository = 'barfoo';

            githubApi.listReleases(owner, repository)
              .catch(error => {
                should.exist(error);
                error.message.should.equal(errMsg);

                listReleasesStub.callCount.should.equal(1);

                return next(null);
              });
          });
        });

        describe('and github api returns with no error', () => {
          let listReleasesStub;
          let releases = [{
            foo: 'bar'
          }];

          before(() => {
            listReleasesStub = sandbox.stub(githubApi._api.releases, 'listReleases', (options, callback) => {
              return callback(null, releases);
            });
          });

          it('should call githubAPi.releases.listReleases() and return a promise', next => {
            let owner = 'foobar';
            let repository = 'barfoo';

            githubApi.listReleases(owner, repository)
              .then(_releases => {
                should.exist(_releases);
                releases.should.equal(_releases);

                listReleasesStub.callCount.should.equal(1);

                return next(null);
              });
          });
        });
      });
    });
  });
});
