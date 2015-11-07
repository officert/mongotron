/* =========================================================================
 * Dependencies
 * ========================================================================= */
const packageJson = require('./package.json');

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const sh = require('shelljs');
const electronConnect = require('electron-connect');
const runSequence = require('run-sequence');
const mocha = require('gulp-mocha');

const appConfig = require('src/config/appConfig');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const APP_NAME = packageJson.name;

const SRC_DIR = 'src';
const DOCS_DIR = 'docs';
const RELEASE_DIR = 'release';
const RELEASE_IGNORE_PKGS = [ //any npm packages that should not be included in the release
  'electron-packager',
  'electron-prebuilt',
  'electron-connect',
  'gulp|gulp-jshint',
  'gulp-less',
  'gulp-mocha',
  'gulp-task-list',
  'jshint-stylish',
  'run-sequence',
  'bower',
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
  sh.rm('-rf', RELEASE_DIR);
  next();
});

gulp.task('css', function() {
  return gulp.src(SRC_DIR + '/ui/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(SRC_DIR + '/ui/css'));
});

gulp.task('site-css', function() {
  return gulp.src(DOCS_DIR + '/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(DOCS_DIR + '/css'));
});

gulp.task('jshint', function() {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release', function(done) {
  runSequence('build', 'pre-release', function() {
    var cmd = './node_modules/.bin/electron-packager ' + '.' + ' ' + APP_NAME + ' --out=' + RELEASE_DIR + ' --platform=darwin  --arch=x64 --version=0.30.2 --ignore="node_modules/(' + RELEASE_IGNORE_PKGS + ')" --icon=' + RELEASE_IMAGE_ICON;

    console.log(cmd);

    sh.exec(cmd, done);
  });
});

gulp.task('pre-release', function(done) {
  var cmd = 'NODE_ENV=production ./node_modules/.bin/electron-compile . -v -t=' + appConfig.builddir;

  console.log(cmd);

  sh.exec(cmd, done);
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
  runSequence('jshint', 'test-int', 'test-unit', function() {
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

/* =========================================================================
 * Helper Functions
 * ========================================================================= */
function _init(stream) {
  stream.setMaxListeners(0);
  return stream;
}
