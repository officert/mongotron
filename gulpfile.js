/* =========================================================================
 * Dependencies
 * ========================================================================= */
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const sh = require('shelljs');
const runSequence = require('run-sequence');
const mocha = require('gulp-spawn-mocha');
const _ = require('underscore');
const childProcess = require('child_process');
const karma = require('karma').server;

const appConfig = require('./src/config/appConfig');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const SRC_DIR = 'src';
const DOCS_DIR = 'docs';
const RELEASE_IGNORE_PKGS = [ //any npm packages that should not be included in the release
  'electron-packager',
  'electron-prebuilt',
  'gulp|gulp-jshint',
  'gulp-less',
  'gulp-mocha',
  'gulp-task-list',
  'jshint-stylish',
  'run-sequence',
  'bower',
  'babel',
  'should',
  'sinon',
  'supertest'
].join('|');
const RELEASE_IMAGE_ICON = __dirname + '/src/ui/images/logo_icon.icns';

const LESSOPTIONS = {
  compress: false
};

const MOCHA_SETTINGS = {
  reporter: 'spec',
  growl: true,
  env: {
    NODE_ENV: 'test'
  }
};

/* =========================================================================
 * Tasks
 * ========================================================================= */
/**
 * List gulp tasks
 */
gulp.task('?', function(next) {
  sh.exec('gulp task-list');
  next();
});

gulp.task('clean', function(next) {
  sh.rm('-rf', appConfig.releasePath);
  sh.rm('-rf', appConfig.buildPath);
  next();
});

gulp.task('css', function() {
  return gulp.src(SRC_DIR + '/ui/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(SRC_DIR + '/ui/css'));
});

gulp.task('site-css', function() {
  return gulp.src(DOCS_DIR + '/less/docs.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(DOCS_DIR + '/css'));
});

gulp.task('jshint', function() {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release', ['pre-release'], function() {
  var env = _.extend({}, process.env);
  env.NODE_ENV = 'production';

  var child = childProcess.spawn('./node_modules/.bin/electron-packager', [
    '.',
    appConfig.name,
    '--out',
    appConfig.releasePath,
    '--platform',
    'darwin',
    '--arch',
    'x64',
    '--version',
    '0.30.2',
    '--ignore', ('node_modules/(' + RELEASE_IGNORE_PKGS + ')'),
    '--icon',
    RELEASE_IMAGE_ICON,
    '--appPath',
    'build/browser/main.js'
  ], {
    env: env
  });

  child.stdout.on('data',
    function(data) {
      console.log('tail output: ' + data);
    }
  );

  child.on('exit', function(exitCode) {
    console.log('Child exited with code: ' + exitCode);
  });
});

gulp.task('pre-release', function(next) {
  // Build Steps:
  //-------------------------------------
  // run build to cleanup dirs and compile less
  // run babel to compile ES6 => ES5
  // run prod-sym-links to change symlinks in node_modules that point to src dir to the build dir (which will contain the compiled ES5 code)
  //-------------------------------------
  runSequence('build', 'babel', 'prod-sym-links', next);
});

gulp.task('babel', function(next) {
  var env = _.extend({}, process.env);
  env.NODE_ENV = 'production';

  var child = childProcess.spawn('./node_modules/.bin/babel', [
    './src',
    '--out-dir',
    appConfig.buildPath,
    '--extensions',
    '.js',
    '--ignore',
    'src/ui/vendor/*'
  ], {
    env: env
  });

  child.stdout.on('data',
    function(data) {
      console.log('tail output: ' + data);
    }
  );

  child.on('exit', function(exitCode) {
    console.log('Child exited with code: ' + exitCode);
    return next(null);
  });
});

gulp.task('prod-sym-links', function(next) {

  childProcess.exec('make createProductionSymLinks', function(err, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (err !== null) {
      console.log('exec error: ' + err);
    }

    return next(err);
  });
});

gulp.task('dev-sym-links', function() {

  childProcess.exec('make createDevelopmentSymLinks', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});

gulp.task('build', ['clean', 'css', 'dev-sym-links']);

gulp.task('serve', ['build'], function(next) {

  var env = _.extend({}, process.env);
  // env.NODE_ENV = 'production';

  var child = childProcess.spawn('./node_modules/.bin/electron', ['./'], {
    env: env
  });

  child.stdout.on('data',
    function(data) {
      console.log('tail output: ' + data);
    }
  );

  child.on('exit', function(exitCode) {
    console.log('Child exited with code: ' + exitCode);
    return next(null);
  });
});

gulp.task('serve-site', ['site-css'], function() {
  gulp.watch(DOCS_DIR + '/less/*.less', function() {
    gulp.src(DOCS_DIR + '/less/docs.less')
      .pipe(less(LESSOPTIONS))
      .pipe(gulp.dest(DOCS_DIR + '/css'));
  });
});

gulp.task('default', ['serve']);

gulp.task('test', function(next) {
  runSequence('jshint', 'test-int', 'test-unit', 'test-unit-ui', function() {
    process.exit(0);
    next();
  });
});

gulp.task('test-int', function() {
  return gulp.src('tests/integration/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

gulp.task('test-unit', function() {
  return gulp.src('tests/unit/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

gulp.task('test-unit-ui', function(done) {

  karma.start({
    configFile: __dirname + '/tests/ui/karma.conf.js',
    singleRun: true,
    files: [
      'karma.shim.js',
      '../../src/ui/vendor/jquery/dist/jquery.min.js',
      '../../src/ui/vendor/toastr/toastr.min.js',
      '../../src/ui/vendor/jquery-ui/jquery-ui.min.js',
      '../../src/ui/vendor/bootstrap/dist/js/bootstrap.js',
      '../../src/ui/vendor/console-polyfill/index.js',
      '../../src/ui/vendor/angular/angular.js',
      '../../src/ui/vendor/angular-ui-sortable/sortable.js',
      '../../src/ui/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      '../../src/ui/vendor/underscore/underscore.js',
      '../../src/ui/vendor/angular-animate/angular-animate.js',
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
      '../../src/ui/vendorCustom/mongotron-codemirror-hint.js',
      '../../src/ui/vendor/angular-mocks/angular-mocks.js',
      '../../src/ui/app.js',
      '../../src/ui/components/**/*.js',
      '../../src/ui/directives/**/*.js',
      '../../src/ui/filters/**/*.js',
      '../../src/ui/services/**/*.js',
      'unit/**/*-test.js'
    ]
  }, done);
});

/* =========================================================================
 * Helper Functions
 * ========================================================================= */
function _init(stream) {
  stream.setMaxListeners(0);
  return stream;
}
