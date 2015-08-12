/* =========================================================================
 * Dependencies
 * ========================================================================= */
var _ = require('underscore');
var packageJson = require('../../package.json');

/* =========================================================================
 * App Config Settings
 * ========================================================================= */
var defaultSettings = {
  VERSION: packageJson.version,
  BUILD_DIR: 'build'
};

var production = _.extend(_.extend({}, defaultSettings), {
  ENV: 'production'
});

var development = _.extend(_.extend({}, defaultSettings), {
  ENV: 'development'
});

var local = _.extend(_.extend({}, defaultSettings), {
  ENV: 'local'
});

var test = _.extend(_.extend({}, defaultSettings), {
  ENV: 'test'
});

var configs = {
  production: production,
  development: development,
  local: local,
  test: test
};

function getConfig(env) {
  var envConfig = configs[env];

  if (!envConfig) throw new Error(env + ' is not a valid environment');

  return envConfig;
}

// exports
module.exports = getConfig(process.env.WERCKER_GIT_BRANCH || process.env.NODE_ENV || process.argv[3] || 'development');
