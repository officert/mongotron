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
  get defaultBindings() {
    return JSON.stringify(DEFAULT_KEYBINDINGS);
  }

  /**
   * @method list
   */
  list() {
    return readKeybindingsFile()
      .then(parseKeybindingsFileData);
  }
}

function readKeybindingsFile() {
  return fileUtils.readJsonFile(appConfig.keybindingsPath);
}

/**
 * @method parseKeybindingsFileData
 * @private
 *
 * @param {Object} data - raw contexts from keybindings file
 */
function parseKeybindingsFileData(data) {
  return new Promise((resolve, reject) => {
    if (!data || !_.isArray(data)) return reject('error parsing keybindings file data');

    //TODO: should we group these by context name to avoid duplicates??

    var commands = [];

    _.each(data, function(context) {
      if (context.commands) {
        for (let key in context.commands) {
          commands.push({
            keystroke: key,
            command: context.commands[key],
            context: context.context
          });
        }
      }
    });

    return resolve(commands);
  });
}

/**
 * @exports
 */
module.exports = new KeybindingsService();
