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
const babel = require('gulp-babel');
const electronPackager = require('electron-packager');
const symlink = require('gulp-symlink');
const electron = require('electron-prebuilt');
// const fontcustom = require('fontcustom');
const fs = require('fs');

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
];
const RELEASE_IMAGE_ICON = __dirname + '/resources/icon/logo_icon';
const RELEASE_OSX_IMAGE_ICON = RELEASE_IMAGE_ICON + '.icns';
const RELEASE_WIN_IMAGE_ICON = RELEASE_IMAGE_ICON + '.ico';
const RELEASE_SETTINGS = {
  dir: '.',
  name: appConfig.name,
  out: appConfig.releasePath,
  version: '0.36.0',
  ignore: RELEASE_IGNORE_PKGS.map((ignore) => {
    return '/node_modules/' + ignore + '($|/)';
  }),
  appPath: 'build/browser/main.js',
  force: true
};

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
gulp.task('?', (next) => {
  sh.exec('gulp task-list');
  next();
});

gulp.task('clean', (next) => {
  sh.rm('-rf', appConfig.releasePath);
  sh.rm('-rf', appConfig.buildPath);
  next();
});

gulp.task('css', () => {
  return gulp.src(SRC_DIR + '/ui/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(SRC_DIR + '/ui/css'));
});

gulp.task('site-css', () => {
  return gulp.src(DOCS_DIR + '/less/docs.less')
    .pipe(less(LESSOPTIONS))
    .pipe(gulp.dest(DOCS_DIR + '/css'));
});

// gulp.task('fonts', function() {
//   return fontcustom({
//     path: 'resources/font-glyphs',
//     output: 'src/ui/font-glyphs',
//     noisy: true,
//     force: true
//   });
// });

gulp.task('jshint', () => {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('release-osx', ['pre-release'], (next) => {
  electronPackager(_.extend(RELEASE_SETTINGS, {
    platform: 'darwin',
    arch: 'x64',
    icon: RELEASE_OSX_IMAGE_ICON,
  }), next);

  // var env = _.extend({}, process.env);
  // env.NODE_ENV = 'production';
  //
  // var child = childProcess.spawn('./node_modules/.bin/electron-packager', [
  //   '.',
  //   appConfig.name,
  //   '--out',
  //   appConfig.releasePath,
  //   '--platform',
  //   'all',
  //   '--arch',
  //   'all',
  //   '--version',
  //   '0.35.0',
  //   '--ignore', ('node_modules/(' + RELEASE_IGNORE_PKGS + ')'),
  //   '--icon',
  //   RELEASE_IMAGE_ICON,
  //   '--appPath',
  //   'build/browser/main.js'
  // ], {
  //   env: env
  // });
  //
  // child.stdout.on('data', (data) => {
  //   console.log('tail output: ' + data);
  // });
  //
  // child.on('exit', (exitCode) => {
  //   console.log('Child exited with code: ' + exitCode);
  //   return next(exitCode === 1 ? new Error('Error running release task') : null);
  // });
});

gulp.task('release-win', ['pre-release'], (next) => {
  electronPackager(_.extend(RELEASE_SETTINGS, {
    platform: 'win32',
    arch: 'all',
    icon: RELEASE_WIN_IMAGE_ICON,
  }), next);
});

gulp.task('release-lin', ['pre-release'], (next) => {
  electronPackager(_.extend(RELEASE_SETTINGS, {
    platform: 'linux',
    arch: 'all',
  }), next);
});

gulp.task('release', ['pre-release'], (next) => {
  electronPackager(_.extend(RELEASE_SETTINGS, {
    platform: 'all',
    arch: 'all',
    icon: RELEASE_IMAGE_ICON,
  }), next);
});

gulp.task('pre-release', (next) => {
  // Build Steps:
  //-------------------------------------
  // run build to cleanup dirs and compile less
  // run babel to compile ES6 => ES5
  // run prod-sym-links to change symlinks in node_modules that point to src dir to the build dir (which will contain the compiled ES5 code)
  //-------------------------------------
  runSequence('build', 'babel', 'prod-sym-links', next);
});

gulp.task('babel', () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      ignore: 'src/ui/vendor/*',

    }))
    .pipe(gulp.dest(appConfig.buildPath));
});

gulp.task('remove-link-src', (next) => {
  unlink('./node_modules/src', next);
});

gulp.task('remove-link-lib', (next) => {
  unlink('./node_modules/lib', next);
});

gulp.task('remove-link-tests', (next) => {
  unlink('./node_modules/tests', next);
});

gulp.task('prod-sym-links', ['remove-link-src', 'remove-link-lib'], () => {
  return gulp.src(['build/', 'build/lib/'])
    .pipe(symlink(['./node_modules/src', './node_modules/lib'], {
      force: true
    }));
});

gulp.task('dev-sym-links', ['remove-link-src', 'remove-link-lib', 'remove-link-tests'], () => {
  return gulp.src(['src/', 'src/lib/', 'tests/'])
    .pipe(symlink(['./node_modules/src', './node_modules/lib', './node_modules/tests'], {
      force: true
    }));
});

gulp.task('build', ['clean', 'css', 'dev-sym-links']);

gulp.task('serve', ['build'], (next) => {

  var env = _.extend({}, process.env);
  // env.NODE_ENV = 'production';

  var child = childProcess.spawn(electron, ['./'], {
    env: env
  });

  child.stdout.on('data', (data) => {
    console.log('tail output: ' + data);
  });

  child.on('exit', (exitCode) => {
    console.log('Child exited with code: ' + exitCode);
    return next(exitCode === 1 ? new Error('Error running serve task') : null);
  });
});

gulp.task('serve-site', ['site-css'], () => {
  gulp.watch(DOCS_DIR + '/less/*.less', () => {
    gulp.src(DOCS_DIR + '/less/docs.less')
      .pipe(less(LESSOPTIONS))
      .pipe(gulp.dest(DOCS_DIR + '/css'));
  });
});

gulp.task('default', ['serve']);

gulp.task('test', (next) => {
  runSequence('jshint', 'test-int', 'test-unit', 'test-unit-ui', next);
});

gulp.task('test-int', () => {
  return gulp.src('tests/integration/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

gulp.task('test-unit', () => {
  return gulp.src('tests/unit/**/**/**-test.js')
    .pipe(mocha(MOCHA_SETTINGS));
});

gulp.task('test-unit-ui', (done) => {
  karma.start({
    configFile: __dirname + '/tests/ui/karma.conf.js',
    singleRun: true,
    files: [
      'karma.shim.js',
      '../../src/ui/vendor/jquery/dist/jquery.min.js',
      '../../src/ui/vendor/toastr/toastr.min.js',
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
      '../../src/ui/vendor/angular-mocks/angular-mocks.js',
      '../../src/ui/app.js',
      '../../src/ui/components/**/*.js',
      '../../src/ui/directives/**/*.js',
      '../../src/ui/filters/**/*.js',
      '../../src/ui/services/**/*.js',
      './**/*-test.js'
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

function unlink(symlink, next) {
  fs.lstat(symlink, function(lerr, lstat) {
    if (lerr || !lstat.isSymbolicLink()) {
      return next();
    }

    fs.unlink(symlink, function() {
      return next();
    });
  });
}
