'use strict';

const Promise = require('bluebird');
const _ = require('underscore');

const appConfig = require('src/config/appConfig');
const fileUtils = require('lib/utils/fileUtils');

const DEFAULT_THEMES = require('./defaults');

/** @module themes */
/** @class */
class ThemesService {
  get defaultThemes() {
    return JSON.stringify(DEFAULT_THEMES);
  }

  /**
   * List themes
   */
  list() {
    return readThemesFile()
      .then(parseThemesFileData);
  }

  /**
   * Change active theme
   * @param {string} themeName - Name of the theme to change to
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
 * @function parseThemesFileData
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

module.exports = new ThemesService();
