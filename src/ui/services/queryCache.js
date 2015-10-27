angular.module('app').service('queryCache', [
  'EVENTS',
  function(EVENTS) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    var QUERY_CACHE = [];

    function QueryCache() {}
    util.inherits(QueryCache, EventEmitter);

    QueryCache.prototype.add = function(query) {
      if (!query) return;

      QUERY_CACHE.push(query);

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);

      return QUERY_CACHE;
    };

    QueryCache.prototype.list = function() {
      return QUERY_CACHE;
    };

    QueryCache.prototype.exists = function(query) {
      var index = QUERY_CACHE.indexOf(query);

      return index >= 0 ? true : false;
    };

    QueryCache.prototype.remove = function(query) {
      var index = QUERY_CACHE.indexOf(query);

      if (index >= 0) {
        QUERY_CACHE.splice(index, 1);
      }

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);

      return QUERY_CACHE;
    };

    QueryCache.prototype.removeActive = function() {
      var activeQuery = _.findWhere(QUERY_CACHE, {
        active: true
      });

      if (activeQuery) this.remove(activeQuery);

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);
    };

    QueryCache.prototype.removeAll = function() {
      QUERY_CACHE = [];

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);

      return QUERY_CACHE;
    };

    QueryCache.prototype.activatePrevious = function() {
      if (QUERY_CACHE.length === 1) return;

      var activeQuery = _.findWhere(QUERY_CACHE, {
        active: true
      });

      if (activeQuery) {
        var index = QUERY_CACHE.indexOf(activeQuery);
        var previousQuery = index === 0 ? QUERY_CACHE[QUERY_CACHE.length - 1] : QUERY_CACHE[index - 1];
        previousQuery.active = true;
        activeQuery.active = false;
      }

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);
    };

    QueryCache.prototype.activateNext = function() {
      if (QUERY_CACHE.length === 1) return;

      var activeQuery = _.findWhere(QUERY_CACHE, {
        active: true
      });

      if (activeQuery) {
        var index = QUERY_CACHE.indexOf(activeQuery);
        var nextQuery = (index === (QUERY_CACHE.length - 1)) ? QUERY_CACHE[0] : QUERY_CACHE[index + 1];
        nextQuery.active = true;
        activeQuery.active = false;
      }

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);
    };

    QueryCache.prototype.deactivateAll = function() {
      _.each(QUERY_CACHE, function(query) {
        query.active = false;
      });

      this.emit(EVENTS.QUERY_CACHE_CHANGED, QUERY_CACHE);
    };

    return new QueryCache();
  }
]);
