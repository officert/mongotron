'use strict';

const Promise = require('bluebird');
const _ = require('underscore');
const semver = require('semver');

const githubApi = require('lib/libs/githubApi');
const appConfig = require('src/config/appConfig');

/** @exports AutoUpdater */
/**
 * @property newestRelease - the newest release, if available
 */
class AutoUpdater {
  /** @constructor */
  constructor() {
    this._latestRelease = null;
  }

  /** @method */
  /**
   * @return Promise
   */
  checkForNewRelease() {
    return new Promise((resolve, reject) => {
      if (this._latestRelease) return resolve(true);

      _getLatestRelease()
        .then(latestRelease => {
          if (!latestRelease) return resolve(false);

          let updateAvailable = semver.lt(appConfig.version, latestRelease.version);

          if (updateAvailable) this._latestRelease = latestRelease;

          return resolve(updateAvailable);
        })
        .catch(reject);
    });
  }

  get latestRelease() {
    return this._latestRelease;
  }
}

function _getLatestRelease() {
  return new Promise((resolve, reject) => {
    githubApi.listReleases(appConfig.repositoryOwner, appConfig.repositoryName)
      .then(releases => {
        if (!releases || !releases.length) return resolve(null);

        let newestRelease = releases[0];

        let assetName = `${appConfig.name}-${process.platform}-${process.arch}.zip`;

        //find the download using the naming schema 'Mongotron-darwin-x64.zip'
        let asset = _.find(newestRelease.assets, asset => {
          return asset.name && asset.name.toLowerCase() === assetName.toLowerCase();
        });

        return resolve({
          url: asset ? asset.browser_download_url : null, //jshint ignore:line
          version: newestRelease.tag_name, //jshint ignore:line
          releaseNotes: newestRelease.body
        });
      })
      .catch(reject);
  });
}

module.exports = new AutoUpdater();
