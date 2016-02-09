'use strict';

const Promise = require('bluebird');
const githubApi = require('lib/libs/githubApi');
const _ = require('underscore');
const semver = require('semver');

const appConfig = require('src/config/appConfig');

/** @exports AutoUpdater */
/**
 * @property newestRelease - the newest release, if available
 */
class AutoUpdater {
  /** @method */
  /**
   * @return Promise
   */
  checkForNewRelease() {
    return new Promise((resolve, reject) => {
      _getLatestRelease()
        .then(latestRelease => {
          let updateAvailable = semver.lt(appConfig.version, latestRelease.version);

          return resolve(updateAvailable ? latestRelease : null);
        })
        .catch(reject);
    });
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
          version: newestRelease.tag_name //jshint ignore:line
        });
      })
      .catch(reject);
  });
}

module.exports = new AutoUpdater();
