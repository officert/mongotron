'use strict';

const fileUtils = require('lib/utils/fileUtils');
const appConfig = require('src/config/appConfig');
const keybindings = require('lib/modules/keybindings');

/**
 * @constructor Mongotron
 *
 */
class Mongotron {
  /**
   * @constructor Mongotron
   */
  constructor() {}

  /**
   * @method init
   */
  init() {
    createConfigDir();
    createAppConfigDir();
    createDbConfigFile();
    createLogFile();
    createKeybindingsFile();
  }
}

function createConfigDir() {
  fileUtils.createDirSync(appConfig.configDir);
}

function createAppConfigDir() {
  fileUtils.createDirSync(appConfig.appConfigDir);
}

function createDbConfigFile() {
  fileUtils.createFileSync(appConfig.dbConfigPath);
}

function createLogFile() {
  fileUtils.createFileSync(appConfig.logFilePath);
}

function createKeybindingsFile() {
  fileUtils.createFileSync(appConfig.keybindingsPath, keybindings.defaultBindings);
}

/**
 * @exports
 */
module.exports = new Mongotron();
