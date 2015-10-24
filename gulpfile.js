/* =========================================================================
 * Dependencies
 * ========================================================================= */
var appConfig = require('src/config/appConfig');

var packageJson = require('./package.json');

var gulp = require('gulp');
var inject = require('gulp-inject'); // jshint ignore:line
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var replace = require('gulp-replace');
var sh = require('shelljs');
var wrap = require('gulp-wrap');
var electronConnect = require('electron-connect');
var runSequence = require('run-sequence');
var mocha = require('gulp-mocha');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const APP_NAME = packageJson.name;

const BUILD_DIR = 'build';
const RELEASE_DIR = 'release';

const VENDOR_JS = [
  BUILD_DIR + '/ui/vendor/bootstrap/dist/js/bootstrap.js',
  BUILD_DIR + '/ui/vendor/console-polyfill/index.js',
  BUILD_DIR + '/ui/vendor/angular/angular.js',
  BUILD_DIR + '/ui/vendor/angular-resource/angular-resource.js',
  BUILD_DIR + '/ui/vendor/angular-ui-router/release/angular-ui-router.js',
  BUILD_DIR + '/ui/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
  BUILD_DIR + '/ui/vendor/underscore/underscore.js',
  BUILD_DIR + '/ui/vendor/angular-animate/angular-animate.js',
  BUILD_DIR + '/ui/vendor/angular-sanitize/angular-sanitize.js',
  BUILD_DIR + '/ui/vendor/angular-scroll/angular-scroll.js',
  BUILD_DIR + '/ui/vendor/jquery.splitter/js/jquery.splitter-0.15.0.js',
  // BUILD_DIR + '/ui/vendor/toastr/toastr.js',
  BUILD_DIR + '/ui/vendor/moment/moment.js',
  BUILD_DIR + '/ui/vendor/angular/angular.js',
  BUILD_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson.js',
  BUILD_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson-tmpl.js',
  BUILD_DIR + '/ui/vendor/Keypress/keypress.js',
  BUILD_DIR + '/ui/vendor/codemirror/lib/codemirror.js',
  BUILD_DIR + '/ui/vendor/codemirror/mode/javascript/javascript.js',
  BUILD_DIR + '/ui/vendor/codemirror/addon/hint/show-hint.js',
  BUILD_DIR + '/ui/vendor/codemirror/addon/hint/javascript-hint.js'
];

const LESSOPTIONS = {
  compress: false
};

const VENDOR_CSS = [
  BUILD_DIR + '/ui/vendor/jquery.splitter/css/jquery.splitter.css',
  BUILD_DIR + '/ui/vendor/toastr/toastr.css',
  BUILD_DIR + '/ui/vendor/codemirror/lib/codemirror.css',
  BUILD_DIR + '/ui/vendor/ng-prettyjson/src/ng-prettyjson.css',
  BUILD_DIR + '/ui/vendor/codemirror/lib/codemirror.css',
  BUILD_DIR + '/ui/vendor/codemirror/addon/hint/show-hint.css'
];

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
  sh.rm('-rf', BUILD_DIR);
  sh.rm('-rf', RELEASE_DIR);
  next();
});

gulp.task('copy', ['clean', 'copy-vendor'], function() {
  return _init(gulp.src(['package.json', 'src/**/*.*']))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy-vendor', ['clean'], function() {
  return _init(gulp.src('src/broswer/vendor/**/**/*.js'))
    .pipe(wrap('(function(){<%= contents %>\n})();'))
    .pipe(gulp.dest(BUILD_DIR + '/ui/vendor'));
});

gulp.task('replace', ['copy'], function() {
  return _replace(gulp.src(['build/**/**/*', '!build/ui/vendor/**/*.js']))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('css', function() {
  var target = gulp.src(BUILD_DIR + '/ui/index.html');

  var sources = gulp.src(BUILD_DIR + '/ui/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(BUILD_DIR + '/ui/css'));

  return target.pipe(inject(sources, {
      starttag: '<!-- injectSrcCss:css -->',
      endtag: '<!-- endinjectSrcCss -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/ui/', '');
        return '<link rel="stylesheet" href="' + path + '"/>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/ui'));
});

gulp.task('css-vendor', function() {
  var target = gulp.src(BUILD_DIR + '/ui/index.html');

  var sources = gulp.src(VENDOR_CSS)
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(BUILD_DIR + '/css'));

  return target.pipe(inject(sources, {
      starttag: '<!-- injectVendorCss:css -->',
      endtag: '<!-- endinjectVendorCss -->',
      transform: function(filepath) {
        var path = filepath.replace('/build', '');
        return '<link rel="stylesheet" href="..' + path + '"/>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/ui'));
});

gulp.task('js', function() {
  var target = gulp.src(BUILD_DIR + '/ui/index.html');

  var sources = gulp.src([BUILD_DIR + '/ui/**/*.js', '!' + BUILD_DIR + '/ui/vendor/**/*.js']);

  return target.pipe(inject(sources, {
      starttag: '<!-- injectSrcJs:js -->',
      endtag: '<!-- endinjectSrcJs -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/ui/', '');
        return '<script src="' + path + '"></script>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/ui'));
});

gulp.task('js-vendor', function() {
  var target = gulp.src(BUILD_DIR + '/ui/index.html');

  var sources = gulp.src(VENDOR_JS);

  return target.pipe(inject(sources, {
      starttag: '<!-- injectVendorJs:js -->',
      endtag: '<!-- endinjectVendorJs -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/ui/', '');
        return '<script src="' + path + '"></script>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/ui'));
});

gulp.task('jshint', ['replace'], function() {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release', ['build'], function(done) {
  sh.exec('./node_modules/.bin/electron-packager ' + BUILD_DIR + ' ' + APP_NAME + ' --out=' + RELEASE_DIR + ' --platform=darwin  --arch=x64 --version=0.30.2', done);
});

gulp.task('build', ['clean', 'copy', 'replace'], function(next) {
  runSequence('css', 'css-vendor', 'js', 'js-vendor', next);
});

gulp.task('serve', ['build'], function() {
  var electron = electronConnect.server.create({
    path: './' + BUILD_DIR
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

function _replace(stream) {
  _init(stream);

  for (var key in appConfig) {
    stream.pipe(replace('@@' + key, appConfig[key], {
      skipBinary: true
    }));
  }

  return stream;
}
