/* =========================================================================
 * Dependencies
 * ========================================================================= */
var _ = require('underscore');
var path = require('path-extra');

var packageJson = require('../../package.json');

/* =========================================================================
 * App Config Settings
 * ========================================================================= */
var defaultSettings = {
  version: packageJson.version,
  name: packageJson.name,
  website: 'http://mongotron.io/',
  repository: packageJson.repository.url,
  logLevel: 'debug',
  buildPath: 'build',
  releasePath: 'release',
  configDir: path.join(path.homedir(), '.config'),
  appConfigDir: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase())),
  logFilePath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'logs.json'),
  dbConfigPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'dbConnections.json'),
  keybindingsPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'keybindings.json'),
  themesPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'themes.json')
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
