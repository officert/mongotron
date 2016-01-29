'use strict';

const babel = require('gulp-babel');
const childProcess = require('child_process');
const electron = require('electron-prebuilt');
const electronPackager = require('electron-packager');
const fs = require('fs');
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');
const jshint = require('gulp-jshint');
const less = require('gulp-less');
const runSequence = require('run-sequence');
const symlink = require('gulp-symlink');
const _ = require('underscore');

let appConfig = require('./src/config/appConfig');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
const SRC_DIR = 'src';
const DOCS_DIR = 'docs';
const RELEASE_IGNORE_PKGS = [ //any npm packages that should not be included in the release
  'bower',
  'babel-preset-es2015',
  'electron-packager',
  'electron-prebuilt',
  'fontcustom',
  'gulp|gulp-*',
  'jasmine-core',
  'jshint|jshint-*',
  'karma|karma-*',
  'run-sequence',
  'shelljs',
  'should',
  'sinon|sinon-*',
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
  'app-version': appConfig.version,
  'version-string': {
    ProductVersion: appConfig.version,
    ProductName: appConfig.name,
  },
  ignore: '/node_modules/(' + RELEASE_IGNORE_PKGS.join('|') + ')',
  appPath: 'build/browser/main.js',
  overwrite: true,
  force: true,
  asar: true,
  prune: true
};

const LESSOPTIONS = {
  compress: false
};

const JSDOC_SETTINGS = {
  access: 'all', //show all access levels (public, private, protected)
  // configure: './conf.json',
  source: {
    exclude: ['src/ui/vendor']
  },
  opts: {
    destination: './docs/jsdocs'
  },
  tags: {
    allowUnknownTags: true
  }
};

/* =========================================================================
 * Tasks
 * ========================================================================= */
/**
 * List gulp tasks
 */
gulp.task('?', ['task-list']);

gulp.task('clean', next => {
  childProcess.exec(`rm -rf ${appConfig.releasePath} && rm -rf ${appConfig.buildPath}`, next);
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

gulp.task('fonts', () => {
  const fontcustom = require('fontcustom');

  return fontcustom({
    path: 'resources/font-glyphs',
    output: 'src/ui/font-glyphs',
    noisy: true,
    force: true
  });
});

/* ------------------------------------------------
 * Code Quality
 * ------------------------------------------------ */
gulp.task('jshint', () => {
  return _init(gulp.src(['src/**/*.js', '!src/ui/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/* ------------------------------------------------
 * Jsdocs
 * ------------------------------------------------ */
gulp.task('jsdoc', next => {
  gulp.src(['README.md', './src/**/*.js'], {
      read: false
    })
    .pipe(jsdoc(JSDOC_SETTINGS, next));
});

gulp.task('open-jsdoc', ['jsdoc'], next => {
  childProcess.exec('open ./docs/jsdocs/index.html', next);
});

/* ------------------------------------------------
 * Release
 * ------------------------------------------------ */
gulp.task('pre-release', next => {
  // Build Steps:
  //-------------------------------------
  // run build to cleanup dirs and compile less
  // run babel to compile ES6 => ES5
  // run prod-sym-links to change symlinks in node_modules that point to src dir to the build dir (which will contain the compiled ES5 code)
  //-------------------------------------
  runSequence('build', 'babel', 'prod-sym-links', next);
});

gulp.task('release-osx', ['pre-release'], (next) => {
  electronPackager(_.extend(RELEASE_SETTINGS, {
    platform: 'darwin',
    arch: 'x64',
    icon: RELEASE_OSX_IMAGE_ICON,
  }), next);
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

gulp.task('babel', () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      ignore: 'src/ui/vendor/*',

    }))
    .pipe(gulp.dest(appConfig.buildPath));
});

/* ------------------------------------------------
 * Sym Links
 * ------------------------------------------------ */
gulp.task('remove-link-src', next => {
  unlink('./node_modules/src', next);
});

gulp.task('remove-link-lib', next => {
  unlink('./node_modules/lib', next);
});

gulp.task('remove-link-tests', next => {
  unlink('./node_modules/tests', next);
});

gulp.task('prod-sym-links', ['remove-link-src', 'remove-link-lib'], () => {
  return gulp.src(['build/', 'build/lib/', 'package.json'])
    .pipe(symlink(['./node_modules/src', './node_modules/lib', './node_modules/package.json'], {
      force: true
    }));
});

gulp.task('dev-sym-links', ['remove-link-src', 'remove-link-lib', 'remove-link-tests'], () => {
  return gulp.src(['src/', 'src/lib/', 'tests/', 'package.json'])
    .pipe(symlink(['./node_modules/src', './node_modules/lib', './node_modules/tests', './node_modules/package.json'], {
      force: true
    }));
});

/* ------------------------------------------------
 * Build
 * ------------------------------------------------ */
gulp.task('build', ['clean', 'css', 'dev-sym-links']);

/* ------------------------------------------------
 * Run
 * ------------------------------------------------ */
gulp.task('run', ['build'], next => {
  var child = childProcess.spawn(electron, ['./']);

  child.stdout.on('data', (data) => {
    console.log(`tail output: ${data}`);
  });

  child.on('exit', (exitCode) => {
    console.log('Child exited with code: ' + exitCode);
    return next(exitCode === 1 ? new Error('Error running run task') : null);
  });
});

/* ------------------------------------------------
 * Run Project Site
 * ------------------------------------------------ */
gulp.task('run-site', ['site-css'], () => {
  gulp.watch(DOCS_DIR + '/less/*.less', () => {
    gulp.src(DOCS_DIR + '/less/docs.less')
      .pipe(less(LESSOPTIONS))
      .pipe(gulp.dest(DOCS_DIR + '/css'));
  });
});

gulp.task('default', ['run']);

/* =========================================================================
 * Helper Functions
 * ========================================================================= */
function _init(stream) {
  stream.setMaxListeners(0);
  return stream;
}

function unlink(symlink, next) {
  fs.lstat(symlink, (lerr, lstat) => {
    if (lerr || !lstat.isSymbolicLink()) {
      return next();
    }

    fs.unlink(symlink, () => {
      return next();
    });
  });
}
