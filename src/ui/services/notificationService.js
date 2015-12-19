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

    NotificationService.prototype.warning = function warning(message, title) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.WARNING, message, title));
    };

    NotificationService.prototype.success = function success(message, title) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.SUCCESS, message, title));
    };

    NotificationService.prototype.error = function error(message, title) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.ERROR, message, title));
    };

    NotificationService.prototype.info = function info(message, title) {
      this.emit(this.EVENTS.NEW_NOTIFICATION, _convertToNotification(this.TYPES.INFO, message, title));
    };

    function _convertToNotification(type, message, title) {
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
