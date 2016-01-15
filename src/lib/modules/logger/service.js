'use strict';

const winston = require('winston');
const Promise = require('bluebird');

const appConfig = require('src/config/appConfig');

const isElectron = process.versions.electron;

var logger = new winston.Logger({
  level: appConfig.logLevel,
  colorize: true,
  transports: [
    new(winston.transports.Console)(),
    new(winston.transports.File)({
      filename: appConfig.logFilePath
    })
  ]
});

/** @module Logger */
/** @class */
class LoggerService {
  constructor() {}

  /**
   * Log a log message
   * @param {string} msg - Message to log
   */
  log(msg) {
    logger.log(msg);
    if (isElectron) {
      console.log(msg);
    }
  }

  /**
   * Log a debug message
   * @param {string} msg - Message to log
   */
  debug(msg) {
    logger.debug(msg);
    if (isElectron) {
      console.log(msg);
    }
  }

  /**
   * Log an info message
   * @param {string} msg - Message to log
   */
  info(msg) {
    logger.info(msg);
    if (isElectron) {
      console.info(msg);
    }
  }

  /**
   * Log a warn message
   * @param {string} msg - Message to log
   */
  warn(msg) {
    logger.warn(msg);
    if (isElectron) {
      console.warn(msg);
    }
  }

  /**
   * Log an error message
   * @param {string} msg - Message to log
   */
  error(msg) {
    logger.error(msg);
    if (isElectron) {
      console.error(msg);
    }
  }

  /**
   * List log messages
   * @param {object} [options] - hash of options for listing
   * @param {date} [options.fromDate]
   * @param {date} [options.toDate]
   * @param {number} [options.skip]
   * @param {number} [options.limit]
   */
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

module.exports = new LoggerService();
