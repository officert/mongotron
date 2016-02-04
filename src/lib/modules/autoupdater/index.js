'use strict';

const BrowserWindow = require('browser-window');
const EventEmitter = require('events');
const Promise = require('bluebird');
const githubApi = require('lib/libs/githubApi');
const _ = require('underscore');

const logger = require('lib/modules/logger');

/** @exports AutoUpdater */
/**
 * @property newestRelease - the newest release, if available
 */
class AutoUpdater extends EventEmitter {
  /** @constructor */
  /**
   * @param {object} options
   * @param {string} options.repository - Github repository name
   * @param {string} options.repositoryOwner - Github repository owner username
   * @param {string} options.version - Current Github release version that your app is running
   */
  constructor(options) {
    if (!options) throw new Error('AutoUpdater - constructor - options is required');
    if (!options.repository) throw new Error('AutoUpdater - constructor - options.repository is required');
    if (!options.repositoryOwner) throw new Error('AutoUpdater - constructor - options.repositoryOwner is required');
    if (!options.updateWindowHtml) throw new Error('AutoUpdater - constructor - options.updateWindowHtml is required');

    super();

    this._repository = options.repository;
    this._repositoryOwner = options.repositoryOwner;
    this._version = options.version;
    this._initialized = false;
    this._newestRelease = null;
    this._updateWindowHtml = options.updateWindowHtml;
  }

  /** @method */
  /**
   * @return Promise<>
   */
  init() {
    this._initialized = true;

    this.checkForUpdates()
      .then(newestRelease => {
        this._newestRelease = newestRelease;

        this.emit('update-available');
      })
      .catch(err => {
        console.log('ERROR CHECKING FOR UPDATES', err);
      });

    this.emit('ready');
  }

  /** @method */
  /**
   * @return Promise<>
   */
  checkForUpdates() {
    if (!this._initialized) throw new Error(new Error('AutoUpdater - checkForUpdates() - must call init() before using AutoUpdater'));

    return new Promise((resolve, reject) => {
      githubApi.listReleases(this._repositoryOwner, this._repository)
        .then(releases => {
          let newRelease = _getNewerRelease(releases, this._version);
          return resolve(newRelease);
        })
        .catch(reject);
    });
  }

  showNewReleaseWindow() {
    if (!this._initialized) throw new Error(new Error('AutoUpdater - checkForUpdates() - must call init() before using AutoUpdater'));

    let updateWindow = new BrowserWindow({
      center: true
    });

    updateWindow.setMinimumSize(770, 400);

    updateWindow.loadUrl(this._updateWindowHtml);

    updateWindow.on('close', () => {});

    //dereference the updateWindow
    updateWindow.on('closed', () => {
      updateWindow = null;
    });
  }

  get newestRelease() {
    return this._newestRelease;
  }
}

function _getNewerRelease(releases, currentVersion) {
  releases = _.sortBy(releases, 'version');

  let currentRelease = _.findWhere(releases, {
    name: `v${currentVersion}` //TODO: shouldn't have to use the naming pattern 'v1.0.0'
  });

  if (!currentRelease) {
    logger.warn(`autoupdater - checkForUpdates() - no release matches the name v${currentRelease}`);
    return null;
  }

  let currentReleaseIndex = releases.indexOf(currentRelease);

  if (currentReleaseIndex !== 0) {
    let latestRelease = releases[0];
    return latestRelease;
  } else {
    return null;
  }
}

module.exports = AutoUpdater;
