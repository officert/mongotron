'use strict';

let GitHubApi = require('github');
let Promise = require('bluebird');

/** @exports GithubApi */
class GithubApi {
  constructor() {
    //expose as private variable so we can mock it when testing
    this._api = new GitHubApi({
      version: '3.0.0'
    });
  }

  /** @method */
  /**
   * @return Promise
   */
  listReleases(owner, repository) {
    return new Promise((resolve, reject) => {
      if (!owner) return reject(new Error('GithubApi - listReleases()- owner is required'));
      if (!repository) return reject(new Error('GithubApi - listReleases()- repository is required'));

      this._api.releases.listReleases({
        owner: owner,
        repo: repository
      }, (err, releases) => {
        if (err) return reject(err);
        return resolve(releases);
      });
    });
  }
}

module.exports = new GithubApi();
