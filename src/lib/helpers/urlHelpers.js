'use strict';

const path = require('path');

var UrlHelpers = {
  getBrowserUrl: function(url) {
    return path.join(getAppBaseUrl(), 'browser', url);
  }
};

function getAppBaseUrl() {
  return path.join(__dirname, '../../');
}

/**
 * @exports
 */
module.exports = UrlHelpers;
