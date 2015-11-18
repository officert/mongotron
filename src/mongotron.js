'use strict';

const fs = require('fs');

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
  var dirExists = false;

  try {
    var stats = fs.lstatSync(appConfig.configDir);

    if (stats.isDirectory()) {
      dirExists = true;
    }
  } catch (e) {
    //eat the error because you'll get an error if the dir doesn't exists,
    //in which case we should create the dir
    console.log(e);
  }

  if (!dirExists) {
    fs.mkdirSync(appConfig.configDir);
  }
}

function createAppConfigDir() {
  var dirExists = false;

  try {
    var stats = fs.lstatSync(appConfig.appConfigDir);

    if (stats.isDirectory()) {
      dirExists = true;
    }
  } catch (e) {
    //eat the error because you'll get an error if the dir doesn't exists,
    //in which case we should create the dir
    console.log(e);
  }

  if (!dirExists) {
    fs.mkdirSync(appConfig.appConfigDir);
  }
}

function createDbConfigFile() {
  var fileExists = false;

  try {
    var stats = fs.lstatSync(appConfig.dbConfigPath);

    if (stats.isFile()) {
      fileExists = true;
    }
  } catch (e) {
    //eat the error because you'll get an error if the dir doesn't exists,
    //in which case we should create the dir
    console.log(e);
  }

  if (!fileExists) {
    fs.writeFileSync(appConfig.dbConfigPath, '');
  }
}

function createLogFile() {
  var fileExists = false;

  try {
    var stats = fs.lstatSync(appConfig.logFilePath);

    if (stats.isFile()) {
      fileExists = true;
    }
  } catch (e) {
    //eat the error because you'll get an error if the dir doesn't exists,
    //in which case we should create the dir
    console.log(e);
  }

  if (!fileExists) {
    fs.writeFileSync(appConfig.logFilePath, '');
  }
}

/**
 * @exports
 */
module.exports = new Mongotron();
