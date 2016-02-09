'use strict';

const Promise = require('bluebird');
const githubApi = require('lib/libs/githubApi');
const _ = require('underscore');
const semver = require('semver');
const shell = require('electron').shell;

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
      if (this._latestRelease) return resolve(this._latestRelease);

      _getLatestRelease()
        .then(latestRelease => {
          let updateAvailable = semver.lt(appConfig.version, latestRelease.version);

          this._latestRelease = latestRelease;

          return resolve(updateAvailable);
        })
        .catch(reject);
    });
  }

  downloadNewRelease() {
    if (!this._latestRelease) return null;
    // if (!this._latestRelease) throw new Error('autoUpdater - downloadNewRelease() - no new release to download');

    shell.openExternal(this._latestRelease.url);
  }

  get latestRelease() {
    return this._latestRelease;
  }
}

function _getLatestRelease() {
  return new Promise((resolve, reject) => {
    githubApi.listReleases(appConfig.repositoryOwner, appConfig.repositoryName)
      .then(releases => {
        let newestRelease = releases[0];

        let assetName = `${appConfig.name}-${process.platform}-${process.arch}.zip`;

        //find the download using the naming schema 'Mongotron-darwin-x64.zip'
        let asset = _.find(newestRelease.assets, asset => {
          return asset.name && asset.name.toLowerCase() === assetName.toLowerCase();
        });

        return resolve({
          url: asset.browser_download_url, //jshint ignore:line
          version: newestRelease.tag_name, //jshint ignore:line
          releaseNotes: newestRelease.body
        });
      })
      .catch(reject);
  });
}

module.exports = new AutoUpdater();
