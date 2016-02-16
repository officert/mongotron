'use strict';

module.exports = config => {

  config.set({
    frameworks: ['jasmine', 'sinon'],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    // plugins: [
    //   'karma-phantomjs-launcher',
    //   'karma-mocha',
    //   'karma-chai',
    //   'karma-spec-reporter',
    //   'karma-sinon'
    // ],
    client: {
      captureConsole: true
    },
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browsers: ['Electron'],
    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,
    // // Continuous Integration mode
    // // if true, it capture browsers, run tests and exit
    singleRun: true,
    files: [
      'karma.shim.js',
      '../../src/ui/vendor/jquery/dist/jquery.min.js',
      '../../src/ui/vendor/jquery-ui/jquery-ui.min.js',
      '../../src/ui/vendor/bootstrap/dist/js/bootstrap.js',
      '../../src/ui/vendor/angular/angular.js',
      '../../src/ui/vendor/angular-ui-sortable/sortable.js',
      '../../src/ui/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      '../../src/ui/vendor/underscore/underscore.js',
      '../../src/ui/vendor/angular-sanitize/angular-sanitize.js',
      '../../src/ui/vendor/angular-auto-grow-input/dist/angular-auto-grow-input.js',
      '../../src/ui/vendor/jquery.splitter/js/jquery.splitter-0.15.0.js',
      '../../src/ui/vendor/moment/moment.js',
      '../../src/ui/vendor/ng-prettyjson/src/ng-prettyjson.js',
      '../../src/ui/vendor/ng-prettyjson/src/ng-prettyjson-tmpl.js',
      '../../src/ui/vendor/Keypress/keypress.js',
      '../../src/ui/vendor/codemirror/lib/codemirror.js',
      '../../src/ui/vendor/codemirror/mode/javascript/javascript.js',
      '../../src/ui/vendor/codemirror/addon/hint/show-hint.js',
      '../../src/ui/vendorCustom/codemirror-formatting.js',
      '../../src/ui/vendorCustom/ng-bs-animated-button.js',
      '../../src/ui/vendor/angular-mocks/angular-mocks.js',
      '../../src/ui/vendor/angular-vs-repeat/src/angular-vs-repeat.js',
      '../../src/ui/app.js',
      '../../src/ui/components/**/*.js',
      '../../src/ui/directives/**/*.js',
      '../../src/ui/filters/**/*.js',
      '../../src/ui/services/**/*.js',
      './**/*-test.js'
    ]
  });
};
