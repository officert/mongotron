'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const appConfig = require('src/config/appConfig');
const fileUtils = require('lib/utils/fileUtils');

const Context = require('./context');

const DEFAULT_KEYBINDINGS = require('./defaults');

/**
 * @class KeybindingsService
 */
class KeybindingsService {
  /**
   * @method list
   */
  listContexts() {
    return readKeybindingsFile()
      .then(parseKeybindingsFileDataAsContexts);
  }

  get defaultBindings() {
    return JSON.stringify(DEFAULT_KEYBINDINGS);
  }
}

function readKeybindingsFile() {
  return fileUtils.readJsonFile(appConfig.keybindingsPath);
}

/**
 * @method parseKeybindingsFileDataAsContexts
 * @private
 *
 * @param {Object} data - raw contexts from keybindings file
 */
function parseKeybindingsFileDataAsContexts(data) {
  return new Promise((resolve, reject) => {
    if (!data || !_.isArray(data)) return reject('error parsing keybindings file data');

    //TODO: should we group these by context name to avoid duplicates??

    return resolve(data.map((context) => {
      return new Context(context.context, context.commands);
    }));
  });
}

/**
 * @exports
 */
module.exports = new KeybindingsService();
