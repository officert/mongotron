'use strict';

const _ = require('underscore');
const path = require('path-extra');

const packageJson = require('../../package.json');

const defaultSettings = {
  version: packageJson.version,
  name: packageJson.name,
  website: 'http://mongotron.io/',
  repository: packageJson.repository.url,
  logLevel: 'debug',
  buildPath: 'build',
  releasePath: 'release',
  appConfigDir: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase())),
  logFilePath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'logs.json'),
  dbConfigPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'dbConnections.json'),
  keybindingsPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'keybindings.json'),
  themesPath: path.join(path.homedir(), '.' + (packageJson.name.toLowerCase()), 'themes.json')
};

const production = _.extend(_.extend({}, defaultSettings), {
  env: 'production'
});

const development = _.extend(_.extend({}, defaultSettings), {
  env: 'development'
});

const local = _.extend(_.extend({}, defaultSettings), {
  env: 'local'
});

const test = _.extend(_.extend({}, defaultSettings), {
  env: 'test',
  dbConfigPath: 'tests/config/dbConnections-test.json'
});

const configs = {
  production: production,
  development: development,
  local: local,
  test: test
};

function getConfig(env) {
  let envConfig = configs[env];

  if (!envConfig) throw new Error(env + ' is not a valid environment');

  console.log('\nENVIRONMENT\n------------------');
  console.log(envConfig);
  console.log('\n');

  return envConfig;
}

/**
 * @exports AppConfig
 */
module.exports = getConfig(process.env.WERCKER_GIT_BRANCH || process.env.NODE_ENV || 'development');
