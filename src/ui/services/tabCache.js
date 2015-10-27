angular.module('app').factory('tabCache', [
  'EVENTS',
  function(EVENTS) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    var TAB_CACHE = [];

    var TAB_TYPES = {
      PAGE: 'PAGE',
      QUERY: 'QUERY'
    };

    function TabCache() {}
    util.inherits(TabCache, EventEmitter);

    TabCache.prototype.TYPES = TAB_TYPES;

    TabCache.prototype.add = function(tab) {
      if (!tab) return;
      if (!(tab.type in TAB_TYPES)) {
        console.error(tab.type + ' is not a valid tab type');
        return;
      }

      if (tab.active === null || tab.active === undefined) tab.active = true;
      if (!tab.iconClassName) tab.iconClassName = getTabIconClasssName(tab.type);

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

    TabCache.prototype.removeActive = function() {
      var activeTab = _.findWhere(TAB_CACHE, {
        active: true
      });

      if (activeTab) this.remove(activeTab);

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.removeAll = function() {
      TAB_CACHE = [];

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.activatePrevious = function() {
      if (TAB_CACHE.length === 1) return;

      var activeTab = _.findWhere(TAB_CACHE, {
        active: true
      });

      if (activeTab) {
        var index = TAB_CACHE.indexOf(activeTab);
        var previousTab = index === 0 ? TAB_CACHE[TAB_CACHE.length - 1] : TAB_CACHE[index - 1];
        previousTab.active = true;
        activeTab.active = false;
      }

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.activateNext = function() {
      if (TAB_CACHE.length === 1) return;

      var activeTab = _.findWhere(TAB_CACHE, {
        active: true
      });

      if (activeTab) {
        var index = TAB_CACHE.indexOf(activeTab);
        var nextTab = (index === (TAB_CACHE.length - 1)) ? TAB_CACHE[0] : TAB_CACHE[index + 1];
        nextTab.active = true;
        activeTab.active = false;
      }

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.deactivateAll = function() {
      _.each(TAB_CACHE, function(tab) {
        tab.active = false;
      });

      this.emit(EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    function getTabIconClasssName(type) {
      var className;

      switch (type) {
        case TAB_TYPES.QUERY:
          className = 'fa fa-files-o';
          break;
        case TAB_TYPES.PAGE:
          className = 'fa fa-file-code-o';
          break;
      }

      return className;
    }

    return new TabCache();
  }
]);
