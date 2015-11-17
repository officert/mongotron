'use strict';

const winston = require('winston');
const Promise = require('bluebird');

const appConfig = require('src/config/appConfig');

const isElectron = process.versions.electron;

var logger = new winston.Logger({
  // level: appConfig.logLevel,
  colorize: true,
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: appConfig.logFilePath
    })
  ]
});

console.log('LOGGER', logger);

/**
 * @class LoggerService
 */
class LoggerService {
  /**
   * @constructor LoggerService
   */
  constructor() {}

  log(msg) {
    logger.log(msg);
    if (isElectron) {
      console.log(msg);
    }
  }

  debug(msg) {
    logger.debug(msg);
    if (isElectron) {
      console.debug(msg);
    }
  }

  info(msg) {
    logger.info(msg);
    if (isElectron) {
      console.info(msg);
    }
  }

  warn(msg) {
    logger.warn(msg);
    if (isElectron) {
      console.warn(msg);
    }
  }

  error(msg) {
    logger.error(msg);
    if (isElectron) {
      console.error(msg);
    }
  }

  list(options) {
    options = options || {};

    var queryOptions = {};
    if (options.fromDate) queryOptions.from = options.fromDate;
    if (options.toDate) queryOptions.until = options.toDate;
    if (options.skip) queryOptions.start = options.skip;
    if (options.limit) queryOptions.limit = options.limit;

    return new Promise(function(resolve, reject) {
      logger.query(queryOptions, function(err, results) {
        if (err) return reject(err);

        return resolve(results);
      });
    });
  }
}

/**
 * @exports
 */
module.exports = new LoggerService();
