angular.module('app').factory('themeService', [
  '$q',
  function($q) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    const THEMES = {
      DEFAULT: 'default',
      ATOM: 'atom',
      ISOTOPE_UI: 'isotope-ui'
    };

    function ThemeService() {
      var _this = this;

      _this.currentTheme = THEMES.ATOM;

      _this.emit(_this.EVENTS.THEME_CHANGED, _this.currentTheme);
    }
    util.inherits(ThemeService, EventEmitter);

    ThemeService.prototype.EVENTS = {
      'THEME_CHANGED': 'THEME_CHANGED'
    };

    ThemeService.prototype.changeCurrent = function(theme) {
      var _this = this;

      if (!_.contains(THEMES, theme)) {
        throw new Error(theme + ' is not a valid theme');
      }

      _this.currentTheme = theme;

      _this.emit(_this.EVENTS.THEME_CHANGED, _this.currentTheme);
    };

    ThemeService.prototype.list = function() {
      var deferred = $q.defer();

      deferred.resolve(_.values(THEMES));

      return deferred.promise;
    };

    return new ThemeService();
  }
]);
