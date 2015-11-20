'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const appConfig = require('src/config/appConfig');
const fileUtils = require('lib/utils/fileUtils');

const DEFAULT_KEYBINDINGS = require('./defaults');

/**
 * @class KeybindingsService
 */
class KeybindingsService {
  /**
   * @method list
   */
  list() {
    return readKeybindingsFile();
  }

  get defaultBindings() {
    return JSON.stringify(DEFAULT_KEYBINDINGS);
  }
}

function readKeybindingsFile() {
  return new Promise(function(resolve, reject) {
    fileUtils.readFile(appConfig.keybindingsPath, function(err, data) {
      if (err) return reject(err);
      var results = parseKeybindingsFileData(data);
      return resolve(results);
    });
  });
}

function parseKeybindingsFileData(data) {
  if (!data || !_.isArray(data)) return null;
}

/**
 * @exports
 */
module.exports = new KeybindingsService();
