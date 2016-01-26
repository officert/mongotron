'use strict';

const fileUtils = require('lib/utils/fileUtils');
const appConfig = require('src/config/appConfig');
const connection = require('lib/modules/connection');
const keybindings = require('lib/modules/keybindings');
const themes = require('lib/modules/themes');

/** @class */
class Mongotron {
  constructor() {}

  init() {
    createAppConfigDir();
    createDbConfigFile();
    createLogFile();
    createKeybindingsFile();
    createThemesFile();
  }
}

function createAppConfigDir() {
  fileUtils.createDirSync(appConfig.appConfigDir);
}

function createDbConfigFile() {
  fileUtils.createFileSync(appConfig.dbConfigPath, connection.defaultConnections);
}

function createLogFile() {
  fileUtils.createFileSync(appConfig.logFilePath);
}

function createKeybindingsFile() {
  fileUtils.createFileSync(appConfig.keybindingsPath, keybindings.defaultBindings);
}

function createThemesFile() {
  fileUtils.createFileSync(appConfig.themesPath, themes.defaultThemes);
}

module.exports = new Mongotron();
