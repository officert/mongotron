/* =========================================================================
 * Dependencies
 * ========================================================================= */
var _ = require('underscore');

// var packageJson = require('../../package.json');
var packageJson = {
  version: 1,
  name: 'Mongotron',
  repository: {
    url: 'htts://github.com/mongotron'
  }
};

/* =========================================================================
 * App Config Settings
 * ========================================================================= */
var defaultSettings = {
  version: packageJson.version,
  name: packageJson.name,
  repository: packageJson.repository.url,
  logLevel: 'debug',
  buildPath: 'build',
  releasePath: 'release',
  logFilePath: '~/.config/' + packageJson.name + '-logs.json',
  dbConfigPath: 'src/config/dbConnections.json'
};

var production = _.extend(_.extend({}, defaultSettings), {
  env: 'production'
});

var development = _.extend(_.extend({}, defaultSettings), {
  env: 'development'
});

var local = _.extend(_.extend({}, defaultSettings), {
  env: 'local'
});

var test = _.extend(_.extend({}, defaultSettings), {
  env: 'test',
  dbConfigPath: 'tests/config/dbConnections-test.json'
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

  console.log('\nENVIRONMENT\n------------------');
  console.log(envConfig);
  console.log('\n');

  return envConfig;
}

// exports
module.exports = getConfig(process.env.WERCKER_GIT_BRANCH || process.env.NODE_ENV || 'development');
