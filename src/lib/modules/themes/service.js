'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const appConfig = require('src/config/appConfig');
const fileUtils = require('lib/utils/fileUtils');

const DEFAULT_THEMES = require('./defaults');

/**
 * @class ThemesService
 */
class ThemesService {
  get defaultThemes() {
    return JSON.stringify(DEFAULT_THEMES);
  }

  /**
   * @method list
   */
  list() {
    return readThemesFile()
      .then(parseThemesFileData);
  }

  /**
   * @method changeActive
   */
  changeActive(themeName) {
    var _this = this;
    var newActiveTheme;

    return _this.list()
      .then((themes) => {
        return new Promise((resolve, reject) => {
          newActiveTheme = _.findWhere(themes, {
            name: themeName
          });

          if (!newActiveTheme) return reject(new Error(themeName + ' is not a valid theme'));

          themes = themes.map(function(theme) {
            theme.active = false;
            return theme;
          });

          newActiveTheme.active = true;

          return resolve(themes);
        });
      })
      .then(writeThemesFile)
      .then(readThemesFile)
      .then(() => {
        return new Promise((resolve) => {
          return resolve(newActiveTheme);
        });
      });
  }
}

function readThemesFile() {
  return fileUtils.readJsonFile(appConfig.themesPath);
}

function writeThemesFile(fileData) {
  return fileUtils.writeJsonFile(appConfig.themesPath, fileData);
}

/**
 * @method parseThemesFileData
 * @private
 *
 * @param {Object} data - raw contexts from themes file
 */
function parseThemesFileData(data) {
  return new Promise((resolve, reject) => {
    if (!data || !_.isArray(data)) return reject('error parsing themes file data');

    return resolve(data);
  });
}

/**
 * @exports ThemesService
 */
module.exports = new ThemesService();
