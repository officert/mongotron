'use strict';

const path = require('path');

/**
 * @class UrlHelpers
 */
class UrlHelpers {

  /**
   * @method getBrowserUrl
   */
  static getBrowserUrl(url) {
    return path.join(getAppBaseUrl(), 'browser', url);
  }
}

function getAppBaseUrl() {
  return path.join(__dirname, '../../');
}

/**
 * @exports
 */
module.exports = UrlHelpers;
