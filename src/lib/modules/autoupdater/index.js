'use strict';

let Promise = require('bluebird');
let githubApi = require('lib/libs/githubApi');

/** @exports AutoUpdater */
class AutoUpdater {
  constructor(options) {
    if (!options) throw new Error('AutoUpdater - constructor - options is required');
    if (!options.repository) throw new Error('AutoUpdater - constructor - options.repository is required');
    if (!options.repositoryOwner) throw new Error('AutoUpdater - constructor - options.repositoryOwner is required');

    this._repository = options.repository;
    this._repositoryOwner = options.repositoryOwner;
  }

  checkForUpdates() {
    return new Promise((resolve, reject) => {
      githubApi.listReleases(this._repositoryOwner, this._repository)
        .then(releases => {
          console.log('releases', releases);

          return resolve(null);
        })
        .catch(reject);
    });
  }
}

module.exports = AutoUpdater;
