/* =========================================================================
 * Dependencies
 * ========================================================================= */
var appConfig = require('../config/appConfig')[process.env.NODE_ENV || 'development'];
// var phantom = require('phantomjs');

/* =========================================================================
 * Exports
 * ========================================================================= */
//https://www.exratione.com/2013/12/angularjs-headless-end-to-end-testing-with-protractor-and-selenium/

module.exports.config = {
  baseUrl: 'http://localhost:' + appConfig.PORT + '/',
  framework: 'jasmine2',
  // troubleshoot: true,
  seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: '../node_modules/selenium/lib/runner/selenium-server-standalone-2.20.0.jar',
  // capabilities: {
  //   browserName: 'phantomjs',
  //   version: '',
  //   platform: 'ANY'
  // },
  // capabilities: {
  //   browserName: 'firefox',
  //   version: '',
  //   platform: 'ANY'
  // },
  capabilities: {
    browserName: 'chrome',
    version: '',
    platform: 'ANY'
  },
  rootElement: 'body',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    isVerbose: true,
    includeStackTrace: true
  }
};
