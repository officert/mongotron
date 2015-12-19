'use strict';

angular.module('app').factory('alertService', [
  function() {
    const util = require('util');
    const EventEmitter = require('events').EventEmitter;

    const TYPES = {
      WARNING: 'WARNING',
      SUCCESS: 'SUCCESS',
      ERROR: 'ERROR',
      INFO: 'INFO'
    };

    function AlertService() {}
    util.inherits(AlertService, EventEmitter);

    AlertService.prototype.EVENTS = {
      NEW_ALERT: 'NEW_ALERT'
    };

    AlertService.prototype.TYPES = TYPES;

    AlertService.prototype.warning = function warning(message, title) {
      this.emit(this.EVENTS.NEW_ALERT, _convertToAlert(this.TYPES.WARNING, message, title));
    };

    AlertService.prototype.success = function success(message, title) {
      this.emit(this.EVENTS.NEW_ALERT, _convertToAlert(this.TYPES.SUCCESS, message, title));
    };

    AlertService.prototype.error = function error(message, title) {
      this.emit(this.EVENTS.NEW_ALERT, _convertToAlert(this.TYPES.ERROR, message, title));
    };

    AlertService.prototype.info = function info(message, title) {
      this.emit(this.EVENTS.NEW_ALERT, _convertToAlert(this.TYPES.INFO, message, title));
    };

    function _convertToAlert(type, message, title) {
      let stackTrace;

      if (_.isError(message)) {
        stackTrace = message.stack;
        message = message.message;
      }
      return {
        type: type,
        title: title,
        message: message,
        stackTrace: stackTrace,
        icon: _getAlertIconByType(type)
      };
    }

    function _getAlertIconByType(type) {
      let icon = null;

      switch (type) {
        case TYPES.WARNING:
          icon = 'fa fa-flash';
          break;
        case TYPES.INFO:
          icon = 'fa fa-info';
          break;
        case TYPES.SUCCESS:
          icon = 'fa fa-check';
          break;
        case TYPES.ERROR:
          icon = 'icon-times';
          break;
      }

      return icon;
    }

    return new AlertService();
  }
]);
