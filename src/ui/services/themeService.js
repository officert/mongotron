angular.module('app').factory('themeService', [
  '$q',
  function($q) {
    const EventEmitter = require('events').EventEmitter;
    const util = require('util');

    const themes = require('lib/modules/themes');

    function ThemeService() {
      var _this = this;

      _this.getActive()
        .then(function(defaultTheme) {
          _this.currentTheme = defaultTheme;
          _this.emit(_this.EVENTS.THEME_CHANGED, _this.currentTheme);
        });
    }
    util.inherits(ThemeService, EventEmitter);

    ThemeService.prototype.EVENTS = {
      'THEME_CHANGED': 'THEME_CHANGED'
    };

    ThemeService.prototype.getActive = function() {
      var _this = this;

      var deferred = $q.defer();

      _this.list()
        .then(function(themes) {
          var defaultTheme = _.findWhere(themes, {
            active: true
          });

          return deferred.resolve(defaultTheme);
        })
        .catch(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    };

    ThemeService.prototype.changeActive = function(themeName) {
      var _this = this;

      var deferred = $q.defer();

      themes.changeActive(themeName)
        .then(function(activeTheme) {

          _this.currentTheme = activeTheme;

          _this.emit(_this.EVENTS.THEME_CHANGED, _this.currentTheme);

          return deferred.resolve(themes);
        })
        .catch(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    };

    ThemeService.prototype.list = function() {
      var deferred = $q.defer();

      themes.list()
        .then(function(data) {
          return deferred.resolve(data);
        })
        .catch(function(err) {
          return deferred.reject(err);
        });

      return deferred.promise;
    };

    return new ThemeService();
  }
]);
