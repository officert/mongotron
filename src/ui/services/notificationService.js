'use strict';

angular.module('app').factory('notificationService', [
  function() {
    const util = require('util');
    const EventEmitter = require('events').EventEmitter;

    const TYPES = {
      WARNING: 'WARNING',
      SUCCESS: 'SUCCESS',
      ERROR: 'ERROR',
      INFO: 'INFO'
    };

    function NotificationService() {}
    util.inherits(NotificationService, EventEmitter);

    NotificationService.prototype.EVENTS = {
      NEW_NOTIFICATION: 'NEW_NOTIFICATION'
    };

    NotificationService.prototype.TYPES = TYPES;

    NotificationService.prototype.warning = function warning(opts) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.WARNING, opts));
    };

    NotificationService.prototype.success = function success(opts) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.SUCCESS, opts));
    };

    NotificationService.prototype.error = function error(opts) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.ERROR, opts));
    };

    NotificationService.prototype.info = function info(opts) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.INFO, opts));
    };

    function _convertToNotification(type, opts) {
      let stackTrace;

      if (_.isString(opts) || _.isError(opts) || (opts instanceof Error)) opts = {
        message: opts
      };

      if (_.isError(opts.message) || (opts.message instanceof Error)) {
        stackTrace = opts.message.stack;
        opts.message = opts.message.message;
      }
      return {
        type: type,
        title: opts.title,
        message: opts.message,
        stackTrace: stackTrace,
        notimeout: opts.notimeout || false,
        icon: _getNotificationIconByType(type)
      };
    }

    function _getNotificationIconByType(type) {
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

    return new NotificationService();
  }
]);
