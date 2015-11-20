angular.module('app').factory('keypressService', [
  '$window',
  '$rootScope',
  '$log',
  function($window, $rootScope, $log) {

    function KeypressService() {
      this.registeredCombos = [];
      this.listener = new $window.keypress.Listener();
    }

    KeypressService.prototype.isRegistered = function isRegistered(combo) {
      var registration = this.registeredCombos[combo];
      return registration ? true : false;
    };

    KeypressService.prototype.registerCombo = function registerCombo(combo, callback) {
      if (this.isRegistered(combo)) {
        $log.warn(combo + ' is already registered, unregistering previous combo');
        this.unregisterCombo(combo);
      }

      $log.debug('Registering keypress combo : ' + combo);

      this.listener.counting_combo(combo, function() { // jshint ignore:line
        callback.call(arguments);
        $rootScope.$apply();
      }, true);
    };

    KeypressService.prototype.unregisterCombo = function unregisterCombo(combo) {
      this.listener.unregister_combo(combo); // jshint ignore:line
    };

    KeypressService.prototype.unregisterAllCombos = function unregisterAllCombos() {
      var _this = this;

      _.each(_this.registeredCombos, function(combo) {
        _this.listener.unregister_combo(combo); // jshint ignore:line
      });
    };

    KeypressService.prototype.EVENTS = {
      CLOSE_WINDOW: 'meta w',
      NEW_TAB: 'meta t',
      MOVE_LEFT: 'meta shift {',
      MOVE_RIGHT: 'meta shift }',
      OPEN_CONNECTION_MANAGER: 'meta shift o',
      RUN_CURRENT_QUERY: 'meta enter'
    };

    return new KeypressService();
  }
]);

// run block for registering keypress events
angular.module('app').run([
  '$rootScope',
  'keypressService',
  'tabCache',
  function($rootScope, keypressService, tabCache) {
    const logger = require('lib/modules/logger');

    $rootScope.$on('$destroy', function() {
      keypressService.unregisterAllCombos();
    });

    keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
      logger.debug(keypressService.EVENTS.CLOSE_WINDOW);
      tabCache.removeActive();
    });

    keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
      logger.debug(keypressService.EVENTS.MOVE_LEFT);
      tabCache.activatePrevious();
    });

    keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
      logger.debug(keypressService.EVENTS.MOVE_RIGHT);
      tabCache.activateNext();
    });

    keypressService.registerCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER, function() {
      logger.debug(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
      $rootScope.showConnections();
    });

    keypressService.registerCombo(keypressService.EVENTS.RUN_CURRENT_QUERY, function() {
      logger.debug(keypressService.EVENTS.RUN_CURRENT_QUERY);
      if ($rootScope.currentQuery && $rootScope.currentQuery.runQuery) {
        $rootScope.currentQuery.runQuery();
      }
    });
  }
]);
