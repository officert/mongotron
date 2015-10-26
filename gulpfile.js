/* =========================================================================
 * Dependencies
 * ========================================================================= */
// const appConfig = require('src/config/appConfig');

const packageJson = require('./package.json');

const gulp = require('gulp');
const inject = require('gulp-inject'); // jshint ignore:line
const jshint = require('gulp-jshint');
const less = require('gulp-less');
// const replace = require('gulp-replace');
const sh = require('shelljs');
// const wrap = require('gulp-wrap');
const electronConnect = require('electron-connect');
const runSequence = require('run-sequence');
const mocha = require('gulp-mocha');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const APP_NAME = packageJson.name;

const SRC_DIR = 'src';
const BUILD_DIR = 'build';
const RELEASE_DIR = 'release';

// const VENDOR_JS = [
//   SRC_DIR + '/ui/vendor/bootstrap/dist/js/bootstrap.js',
//   SRC_DIR + '/ui/vendor/console-polyfill/index.js',
//   SRC_DIR + '/ui/vendor/angular/angular.js',
//   SRC_DIR + '/ui/vendor/angular-resource/angular-resource.js',
//   SRC_DIR + '/ui/vendor/angular-ui-router/release/angular-ui-router.js',
//   SRC_DIR + '/ui/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
//   SRC_DIR + '/ui/vendor/underscore/underscore.js',
//   SRC_DIR + '/ui/vendor/angular-animate/angular-animate.js',
//   SRC_DIR + '/ui/vendor/angular-sanitize/angular-sanitize.js',
//   SRC_DIR + '/ui/vendor/angular-scroll/angular-scroll.js',
//   SRC_DIR + '/ui/vendor/jquery.splitter/js/jquery.splitter-0.15.0.js',
//   // SRC_DIR + '/ui/vendor/toastr/toastr.js',
//   SRC_DIR + '/ui/vendor/moment/moment.js',
//   SRC_DIR + '/ui/vendor/angular/angular.js',
//   SRC_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson.js',
//   SRC_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson-tmpl.js',
//   SRC_DIR + '/ui/vendor/Keypress/keypress.js',
//   SRC_DIR + '/ui/vendor/codemirror/lib/codemirror.js',
//   SRC_DIR + '/ui/vendor/codemirror/mode/javascript/javascript.js',
//   SRC_DIR + '/ui/vendor/codemirror/addon/hint/show-hint.js',
//   SRC_DIR + '/ui/vendor/codemirror/addon/hint/javascript-hint.js'
// ];

const LESSOPTIONS = {
  compress: false
};

// const VENDOR_CSS = [
//   SRC_DIR + '/ui/vendor/jquery.splitter/css/jquery.splitter.css',
//   SRC_DIR + '/ui/vendor/toastr/toastr.css',
//   SRC_DIR + '/ui/vendor/codemirror/lib/codemirror.css',
//   SRC_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson.css',
//   SRC_DIR + '/ui/vendor/codemirror/lib/codemirror.css',
//   SRC_DIR + '/ui/vendor/codemirror/addon/hint/show-hint.css'
// ];

const MOCHA_SETTINGS = {
  reporter: 'spec',
  growl: true,
  useColors: true,
  useInlineDiffs: true
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
  // sh.rm('-rf', BUILD_DIR);
  sh.rm('-rf', RELEASE_DIR);
  next();
});

gulp.task('css', function() {
  return gulp.src(SRC_DIR + '/ui/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(SRC_DIR + '/ui/css'));
});

gulp.task('jshint', function() {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release', ['build'], function(done) {
  sh.exec('NODE_ENV=production ./node_modules/.bin/electron-packager ' + BUILD_DIR + ' ' + APP_NAME + ' --out=' + RELEASE_DIR + ' --platform=darwin  --arch=x64 --version=0.30.2', done);
});

gulp.task('build', ['clean', 'css']);

gulp.task('serve', ['build'], function() {
  var electron = electronConnect.server.create({
    path: './'
  });

  // Start browser process
  electron.start();
});

gulp.task('default', ['serve']);

gulp.task('test', function(next) {
  runSequence('jshint', 'test-int', 'test-unit', next);
});

gulp.task('test-int', function() {
  return gulp.src('tests/integration/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

gulp.task('test-unit', function() {
  return gulp.src('tests/unit/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

/* =========================================================================
 * Helper Functions
 * ========================================================================= */
function _init(stream) {
  stream.setMaxListeners(0);
  return stream;
}
