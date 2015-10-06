/* =========================================================================
 * Dependencies
 * ========================================================================= */
var appConfig = require('src/config/appConfig');

var ENV = appConfig.ENV;
var ENV_PROD = ENV === 'production';

var child_process = require('child_process');

var packageJson = require('./package.json');

var gulp = require('gulp');
var gulpIf = require('gulp-if');
var inject = require('gulp-inject');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var less = require('gulp-less');
var uglify = require('gulp-uglifyjs');
var replace = require('gulp-replace');
var sh = require('shelljs');
var protractor = require('gulp-protractor').protractor;
var concat = require('gulp-concat');
// var _ = require('underscore');
var wrap = require('gulp-wrap');
var uuid = require('node-uuid');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');

require('gulp-task-list')(gulp);

/* =========================================================================
 * Constants
 * ========================================================================= */
var APP_NAME = packageJson.name;

var BUILD_DIR = 'build';
var RELEASE_DIR = 'release';

var BUILD_ID = uuid.v4();

//js
var MINIFIED_SRC_SCRIPT = 'app-src-' + BUILD_ID + '.min.js';
var MINIFIED_VENDOR_SCRIPT = 'app-vendor-' + BUILD_ID + '.min.js';

var UGLIFYOPTIONS = {
  mangle: false,
  compress: true,
  output: {
    comments: false
  }
};

var VENDOR_JS = [
  // BUILD_DIR + '/browser/vendor/jquery/dist/jquery.js',
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
  BUILD_DIR + '/browser/vendor-custom/toastr/toastr.js',
  BUILD_DIR + '/browser/vendor/moment/moment.js',
  BUILD_DIR + '/browser/vendor/codemirror/lib/codemirror.js',
  BUILD_DIR + '/browser/vendor/angular/angular.js',
  BUILD_DIR + '/browser/vendor/angular-ui-codemirror/ui-codemirror.js',
  BUILD_DIR + '/browser/vendor/ng-prettyjson/src/ng-prettyjson.js',
  BUILD_DIR + '/browser/vendor/ng-prettyjson/src/ng-prettyjson-tmpl.js',
  BUILD_DIR + '/browser/vendor/Keypress/keypress.js'
];

//css
var MINIFIED_SRC_CSS = 'app-src-' + BUILD_ID + '.css';
var MINIFIED_VENDOR_CSS = 'app-vendor-' + BUILD_ID + '.css';

var LESSOPTIONS = {
  compress: ENV_PROD
};

var VENDOR_CSS = [
  // BUILD_DIR + '/fonts/fonts.css'
  BUILD_DIR + '/browser/vendor/jquery.splitter/css/jquery.splitter.css',
  BUILD_DIR + '/browser/vendor-custom/toastr/toastr.css',
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

/**
 * Clean the build directory
 */
gulp.task('clean', function(next) {
  sh.rm('-rf', BUILD_DIR);
  sh.rm('-rf', RELEASE_DIR);
  next();
});

/**
 * Copy src folder to build directory
 */
gulp.task('copy', ['clean', 'copy-bower'], function() {
  return _init(gulp.src(['package.json', 'src/**/*.*']))
    .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('copy-bower', ['clean'], function() {
  return _init(gulp.src('src/broswer/vendor/**/**/*.js'))
    .pipe(wrap('(function(){<%= contents %>\n})();'))
    .pipe(gulp.dest(BUILD_DIR + '/browser/vendor'));
});

/**
 * Replace vars in config
 */
gulp.task('replace', ['copy'], function() {
  return _replace(gulp.src(['build/**/**/*', '!build/browser/vendor/**/*.js']))
    .pipe(gulp.dest(BUILD_DIR));
});

/**
 * Compile .less files to .css
 */
gulp.task('css', ['js', 'css-vendor'], function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src(BUILD_DIR + '/browser/less/main.less')
    .pipe(less(LESSOPTIONS))
    .pipe(rename(MINIFIED_SRC_CSS))
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

gulp.task('css-vendor', ['js', 'copy', 'replace'], function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src(VENDOR_CSS)
    .pipe(less(LESSOPTIONS))
    .pipe(concat(MINIFIED_VENDOR_CSS))
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

/**
 * Minify javascript files
 */
gulp.task('js', ['js-vendor', 'copy', 'replace'], function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src([BUILD_DIR + '/browser/**/*.js', '!' + BUILD_DIR + '/browser/vendor/**/*.js', '!' + BUILD_DIR + '/browser/' + MINIFIED_VENDOR_SCRIPT])
    .pipe(gulpIf(ENV_PROD, uglify(MINIFIED_SRC_SCRIPT, UGLIFYOPTIONS)))
    .pipe(gulpIf(ENV_PROD, gulp.dest(BUILD_DIR + '/browser')));

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

gulp.task('js-vendor', ['copy', 'replace'], function() {
  var target = gulp.src(BUILD_DIR + '/browser/index.html');

  var sources = gulp.src(VENDOR_JS)
    .pipe(gulpIf(ENV_PROD, uglify(MINIFIED_VENDOR_SCRIPT, UGLIFYOPTIONS)))
    .pipe(gulpIf(ENV_PROD, gulp.dest(BUILD_DIR + '/browser')));

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

/**
 * Minify Html Files
 */
gulp.task('html', ['css', 'js'], function() {
  return gulp.src(BUILD_DIR + '/**/**/*.html')
    .pipe(gulpIf(ENV_PROD, minifyHTML()))
    .pipe(gulp.dest(BUILD_DIR));
});

/**
 * Js Hint
 */
gulp.task('jshint', ['replace'], function() {
  return _init(gulp.src(['src/**/*.js', '!src/browser/vendor/**/*.js']))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

// gulp.task('start', ['default'], function() {
//
//   // LESS
//   (function processLess(paths) {
//     paths.forEach(function(path) {
//       watch(path, {
//         emit: 'one',
//         emitOnGlob: false
//       }, function(files) {
//         //copy the changes less files to the build dir
//         files
//           .pipe(gulp.dest(BUILD_DIR + '/less'));
//
//         //reprocess main.less in the build dir - regenerate css
//         return gulp.src(BUILD_DIR + '/less/main.less')
//           .pipe(less(LESSOPTIONS))
//           .pipe(rename(MINIFIED_SRC_CSS))
//           .pipe(gulp.dest(BUILD_DIR + '/css'));
//       });
//     });
//   })(['src/less/**/**/*.less']);
//
//   (function processJs() {
//     console.log('watching js files');
//
//     watch('src/app/**/**/*.js', {
//       emit: 'one',
//       emitOnGlob: false
//     }, function(files) {
//       //copy the changed js files to the build dir
//       return _replace(files)
//         .pipe(gulp.dest(BUILD_DIR + '/app'));
//     });
//   }());
//
//   (function processHtml(paths) {
//     console.log('watching html files');
//
//     paths.forEach(function(path) {
//       var dest = path.split('/').slice(0, -1).join('/').replace('src', BUILD_DIR).replace(/\*/gi, '');
//       watch(path, {
//         emit: 'one',
//         emitOnGlob: false
//       }, function(files) {
//         return _replace(files)
//           .pipe(gulp.dest(dest));
//       });
//
//     });
//   }(['src/**/**/*.html']));
//
//   return require('./server');
// });

// gulp.task('package', ['default'], function(done) {
//   sh.exec('asar pack ' + BUILD_DIR + ' ' + RELEASE_DIR + '/' + APP_NAME + '.asar', done);
// });

gulp.task('release', ['default'], function(done) {
  sh.exec('electron-packager ' + BUILD_DIR + ' ' + APP_NAME + ' --out=' + RELEASE_DIR + ' --platform=darwin  --arch=x64 --version=0.30.2', done);
});

gulp.task('run', ['default'], function(next) {
  sh.exec('./node_modules/.bin/electron ' + BUILD_DIR, next);
});

/**
 * Run all steps in order
 */
// gulp.task('default', ['jshint', 'clean', 'copy', 'replace', 'css', 'js', 'html']);
gulp.task('default', ['clean', 'copy', 'replace', 'css', 'js', 'html']);

/**
 * Run unit and e2e tests - this task is run by Wercker when building our app
 */
gulp.task('test', ['test-unit', 'default'], function() {});

gulp.task('test-unit', ['default'], function(done) {

  var cdnScripts = [
    'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js',
    'http://twemoji.maxcdn.com/twemoji.min.js',
    'http://www.google-analytics.com/analytics.js'
  ];
  var vendorScripts = VENDOR_JS.map(function(path) {
    return '../' + path;
  });

  var files = cdnScripts.concat(vendorScripts);

  karma.start({
    configFile: __dirname + '/tests/karma.conf.js',
    singleRun: true,
    files: files.concat([
      '../build/bower_components/angular-mocks/angular-mocks.js',
      '../build/**/**/**/*.js',
      'lib/**/*.js',
      'unit/**/*.spec.js'
    ])
  }, done);
});

gulp.task('test-e2e', ['server'], function() {
  child_process.exec('webdriver-manager start');

  gulp.src(['tests/e2e/**/**/*.spec.js'])
    .pipe(protractor({
      configFile: 'tests/protractor.conf.js'
    }))
    .on('end', function() {
      process.exit(0); //force gulp to exit
    });
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

function setupEnv(env) {
  // allow passing name as an argument
  if (env && env.indexOf('-') === 0) env = env.substring(1);

  // production
  if (env === 'master' || env === 'prod' || env === 'production') return 'production';
  // development
  else if (env === 'dev' || env === 'development') return 'development';
  // local
  else if (env === 'local') return 'local';
  // default
  else return 'development';
}
