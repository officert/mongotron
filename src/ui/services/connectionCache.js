angular.module('app').factory('connectionCache', [
  'EVENTS',
  function(EVENTS) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    var CONNECTION_CACHE = [];

    function ConnectionCache() {}
    util.inherits(ConnectionCache, EventEmitter);

    ConnectionCache.prototype.add = function(connection) {
      if (!connection) return;

      CONNECTION_CACHE.push(connection);

      this.emit(EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);

      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.list = function() {
      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.exists = function(connection) {
      var index = CONNECTION_CACHE.indexOf(connection);

      return index >= 0 ? true : false;
    };

    ConnectionCache.prototype.remove = function(connection) {
      var index = CONNECTION_CACHE.indexOf(connection);

      if (index >= 0) {
        CONNECTION_CACHE.splice(index, 1);
      }

      this.emit(EVENTS.CONNECTION_CACHE_CHANGED, CONNECTION_CACHE);

      return CONNECTION_CACHE;
    };

    ConnectionCache.prototype.removeAll = function() {
      CONNECTION_CACHE = [];
    };

    return new ConnectionCache();
  }
]);
