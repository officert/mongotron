angular.module('app').factory('tabCache', [
  function() {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');
    const uuid = require('node-uuid');

    var TAB_CACHE = [];

    var TAB_TYPES = {
      PAGE: 'PAGE',
      QUERY: 'QUERY'
    };

    function TabCache() {}
    util.inherits(TabCache, EventEmitter);

    TabCache.prototype.TYPES = TAB_TYPES;

    TabCache.prototype.EVENTS = {
      TAB_CACHE_CHANGED: 'TAB_CACHE_CHANGED'
    };

    TabCache.prototype.add = function(tab) {
      if (!tab) throw new Error('tab is required');
      if (!tab.name) throw new Error('tab.name is required');
      if (!(tab.type in TAB_TYPES)) throw new Error(tab.type + ' is not a valid tab type');

      tab.id = uuid.v4();
      tab.active = true;

      if (!tab.iconClassName) tab.iconClassName = getTabIconClasssName(tab.type);

      _deactivateAll(); //deactivate any other tabs before adding a new active tab

      TAB_CACHE.push(tab);

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);

      return tab;
    };

    TabCache.prototype.getById = function(id) {
      if (!id) throw new Error('id is required');

      var tab = _.findWhere(TAB_CACHE, {
        id: id
      });

      return tab;
    };

    TabCache.prototype.list = function() {
      return TAB_CACHE;
    };

    TabCache.prototype.exists = function(tab) {
      if (!tab) throw new Error('tab is required');

      var index = TAB_CACHE.indexOf(tab);

      return index >= 0 ? true : false;
    };

    TabCache.prototype.existsByName = function(name) {
      if (!name) throw new Error('name is required');

      var tabs = _.where(TAB_CACHE, {
        name: name
      });

      return tabs && tabs.length ? true : false;
    };

    TabCache.prototype.remove = function(tab) {
      var index = TAB_CACHE.indexOf(tab);

      if (index >= 0) {
        _activatePrevious(index);

        TAB_CACHE.splice(index, 1);
      }

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);

      return TAB_CACHE;
    };

    TabCache.prototype.removeActive = function() {
      var activeTab = _.findWhere(TAB_CACHE, {
        active: true
      });

      if (activeTab) this.remove(activeTab);

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.removeAll = function() {
      TAB_CACHE = [];

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.removeByCollection = function(collection) {
      if (!collection) return;

      var _this = this;

      var tabs = _.filter(TAB_CACHE, function(tab) {
        return tab.collection === collection;
      });

      if (!tabs || !tabs.length) return;

      tabs.map(_this.remove.bind(_this));

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.removeByDatabase = function(database) {
      if (!database) return;

      var _this = this;

      var tabs = _.filter(TAB_CACHE, function(tab) {
        return tab.collection && tab.collection.database === database;
      });

      if (!tabs || !tabs.length) return;

      tabs.map(_this.remove.bind(_this));

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.removeByConnectionId = function(id) {
      if (!id) return;

      var _this = this;

      var tabs = _.filter(TAB_CACHE, function(tab) {
        return tab.collection && tab.collection.connection && tab.collection.connection.id === id;
      });

      if (!tabs || !tabs.length) return;

      tabs.map(_this.remove.bind(_this));

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.activateById = function(id) {
      var tab = this.getById(id);

      if (!tab) return;

      this.deactivateAll();

      tab.active = true;

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.activatePrevious = function(tabIndex) {
      _activatePrevious(tabIndex);

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
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

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    TabCache.prototype.activateByName = function(name) {
      var tab = _.findWhere(TAB_CACHE, {
        name: name
      });

      if (tab) {
        _deactivateAll();
        tab.active = true;

        this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
      }
    };

    TabCache.prototype.deactivateAll = function() {
      _deactivateAll();

      this.emit(this.EVENTS.TAB_CACHE_CHANGED, TAB_CACHE);
    };

    function getTabIconClasssName(type) {
      var className;

      switch (type) {
        case TAB_TYPES.QUERY:
          className = '';
          break;
        case TAB_TYPES.PAGE:
          className = 'fa fa-file-code-o';
          break;
      }

      return className;
    }

    function _deactivateAll() {
      _.each(TAB_CACHE, function(tab) {
        tab.active = false;
      });
    }

    function _activatePrevious(tabIndex) {
      if (TAB_CACHE.length === 1) return;

      var activeTab = index ? TAB_CACHE[tabIndex] : _.findWhere(TAB_CACHE, {
        active: true
      });

      if (activeTab) {
        var index = TAB_CACHE.indexOf(activeTab);
        var previousTab = index === 0 ? TAB_CACHE[TAB_CACHE.length - 1] : TAB_CACHE[index - 1];
        previousTab.active = true;
        activeTab.active = false;
      }
    }

    return new TabCache();
  }
]);
