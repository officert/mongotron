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

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const APP_NAME = packageJson.name;

const BUILD_DIR = 'build';
const RELEASE_DIR = 'release';

const VENDOR_JS = [
  BUILD_DIR + '/browser/vendor/bootstrap/dist/js/bootstrap.js',
  BUILD_DIR + '/browser/vendor/console-polyfill/index.js',
  BUILD_DIR + '/browser/vendor/angular/angular.js',
  BUILD_DIR + '/browser/vendor/angular-resource/angular-resource.js',
  BUILD_DIR + '/browser/vendor/angular-ui-router/release/angular-ui-router.js',
  BUILD_DIR + '/browser/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
  BUILD_DIR + '/browser/vendor/underscore/underscore.js',
  BUILD_DIR + '/browser/vendor/angular-animate/angular-animate.js',
  BUILD_DIR + '/browser/vendor/angular-sanitize/angular-sanitize.js',
  BUILD_DIR + '/browser/vendor/angular-scroll/angular-scroll.js',
  BUILD_DIR + '/browser/vendor/jquery.splitter/js/jquery.splitter-0.15.0.js',
  // BUILD_DIR + '/browser/vendor/toastr/toastr.js',
  BUILD_DIR + '/browser/vendor/moment/moment.js',
  BUILD_DIR + '/browser/vendor/codemirror/lib/codemirror.js',
  BUILD_DIR + '/browser/vendor/angular/angular.js',
  BUILD_DIR + '/browser/vendor/angular-ui-codemirror/ui-codemirror.js',
  BUILD_DIR + '/browser/vendor/ng-prettyjson/src/ng-prettyjson.js',
  BUILD_DIR + '/browser/vendor/ng-prettyjson/src/ng-prettyjson-tmpl.js',
  BUILD_DIR + '/browser/vendor/Keypress/keypress.js'
];

const LESSOPTIONS = {
  compress: false
};

const VENDOR_CSS = [
  BUILD_DIR + '/browser/vendor/jquery.splitter/css/jquery.splitter.css',
  BUILD_DIR + '/browser/vendor/toastr/toastr.css',
  BUILD_DIR + '/browser/vendor/codemirror/lib/codemirror.css',
  BUILD_DIR + '/browser/vendor/ng-prettyjson/src/ng-prettyjson.css'
];

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
    .pipe(gulp.dest(BUILD_DIR + '/browser/vendor'));
});

gulp.task('replace', ['copy'], function() {
  return _replace(gulp.src(['build/**/**/*', '!build/browser/vendor/**/*.js']))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('css', function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src(BUILD_DIR + '/browser/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(BUILD_DIR + '/browser/css'));

  return target.pipe(inject(sources, {
      starttag: '<!-- injectSrcCss:css -->',
      endtag: '<!-- endinjectSrcCss -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/browser/', '');
        return '<link rel="stylesheet" href="' + path + '"/>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/browser'));
});

gulp.task('css-vendor', function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

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
    .pipe(gulp.dest(BUILD_DIR + '/browser'));
});

gulp.task('js', function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src([BUILD_DIR + '/browser/**/*.js', '!' + BUILD_DIR + '/browser/vendor/**/*.js']);

  return target.pipe(inject(sources, {
      starttag: '<!-- injectSrcJs:js -->',
      endtag: '<!-- endinjectSrcJs -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/browser/', '');
        return '<script src="' + path + '"></script>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/browser'));
});

gulp.task('js-vendor', function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src(VENDOR_JS);

  return target.pipe(inject(sources, {
      starttag: '<!-- injectVendorJs:js -->',
      endtag: '<!-- endinjectVendorJs -->',
      transform: function(filepath) {
        var path = filepath.replace('/build/browser/', '');
        return '<script src="' + path + '"></script>';
      }
    }))
    .pipe(gulp.dest(BUILD_DIR + '/browser'));
});

gulp.task('jshint', ['replace'], function() {
  return _init(gulp.src(['src/**/*.js', '!src/browser/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release', ['build'], function(done) {
  sh.exec('electron-packager ' + BUILD_DIR + ' ' + APP_NAME + ' --out=' + RELEASE_DIR + ' --platform=darwin  --arch=x64 --version=0.30.2', done);
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

  // Restart browser process
  gulp.watch('src/main.js', ['default', electron.restart]);

  // Reload renderer process
  gulp.watch(['src/browser/app.js', 'src/browser/index.html'], ['default', electron.reload]);
});

gulp.task('default', ['serve']);

gulp.task('test', ['jshint'], function() {});

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
