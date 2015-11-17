/* =========================================================================
 * Dependencies
 * ========================================================================= */
const packageJson = require('./package.json');

const gulp = require('gulp');
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const sh = require('shelljs');
const runSequence = require('run-sequence');
const mocha = require('gulp-spawn-mocha');
const _ = require('underscore');
const childProcess = require('child_process');

const appConfig = require('src/config/appConfig');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const APP_NAME = packageJson.name;

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

gulp.task('release', function() {
  runSequence('build', 'pre-release', function() {
    var env = _.extend({}, process.env);
    env.NODE_ENV = 'production';

    var child = childProcess.spawn('./node_modules/.bin/electron-packager', [
      '.',
      APP_NAME,
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
});

/*
 * @task pre-release - compile ES6 to ES5 using babel
 */
gulp.task('pre-release', function() {
  _init(gulp.src(['src/**/*.html', 'src/**/*.less', 'src/**/*.css']))
    .pipe(gulp.dest(appConfig.buildPath));

  _init(gulp.src(['src/ui/vendor/**/*.*']))
    .pipe(gulp.dest(appConfig.buildPath + '/ui/vendor'));

  var child = childProcess.spawn('./node_modules/.bin/babel', [
    './src',
    '--out-dir',
    appConfig.buildPath,
    '--extensions',
    '.js',
    '--ignore',
    'src/ui/vendor/*'
  ]);

  child.stdout.on('data',
    function(data) {
      console.log('tail output: ' + data);
    }
  );

  child.on('exit', function(exitCode) {
    console.log('Child exited with code: ' + exitCode);
  });
});

gulp.task('build', ['clean', 'css']);

gulp.task('serve', ['build'], function() {

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
  });
});

gulp.task('serve-site', function() {
  gulp.watch(DOCS_DIR + '/less/*.less', function() {
    gulp.src(DOCS_DIR + '/less/main.less')
      .pipe(less(LESSOPTIONS))
      .pipe(gulp.dest(DOCS_DIR + '/css'));
  });
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
