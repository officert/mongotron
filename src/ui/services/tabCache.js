angular.module('app').service('tabCache', [
  'EVENTS',
  function(EVENTS) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    var TAB_CACHE = [];

    function TabCache() {}
    util.inherits(TabCache, EventEmitter);

    TabCache.prototype.add = function(tab) {
      if (!tab) return;

      TAB_CACHE.push(tab);

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);

      return TAB_CACHE;
    };

    TabCache.prototype.list = function() {
      return TAB_CACHE;
    };

    TabCache.prototype.exists = function(tab) {
      var index = TAB_CACHE.indexOf(tab);

      return index >= 0 ? true : false;
    };

    TabCache.prototype.remove = function(tab) {
      var index = TAB_CACHE.indexOf(tab);

      if (index >= 0) {
        TAB_CACHE.splice(index, 1);
      }

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);

      return TAB_CACHE;
    };

    TabCache.prototype.removeAll = function() {
      TAB_CACHE = [];

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    return new TabCache();
  }
]);
