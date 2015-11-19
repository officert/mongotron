'use strict';

const fileUtils = require('lib/utils/fileUtils');
const appConfig = require('src/config/appConfig');

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
  }
}

function createConfigDir() {
  fileUtils.createDir(appConfig.configDir);
}

function createAppConfigDir() {
  fileUtils.createDir(appConfig.appConfigDir);
}

function createDbConfigFile() {
  fileUtils.createFile(appConfig.dbConfigPath);
}

function createLogFile() {
  fileUtils.createFile(appConfig.logFilePath);
}

/**
 * @exports
 */
module.exports = new Mongotron();
