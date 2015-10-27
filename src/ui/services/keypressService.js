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
          $log.error(combo + ' is already registered, unregistering previous combo');
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

      KeypressService.prototype.EVENTS = {
        CLOSE_WINDOW: 'meta w',
        NEW_TAB: 'meta t',
        MOVE_LEFT: 'meta shift {',
        MOVE_RIGHT: 'meta shift }',
        OPEN_CONNECTION_MANAGER: 'meta shift n'
      };

      return new KeypressService();
    }
  ])
  .run([
    '$rootScope',
    'keypressService',
    'tabCache',
    function($rootScope, keypressService, tabCache) {
      $rootScope.$on('$destroy', function() {
        keypressService.unregisterCombo(keypressService.EVENTS.CLOSE_WINDOW);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_LEFT);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_RIGHT);
        keypressService.unregisterCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
      });

      keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
        console.log(keypressService.EVENTS.CLOSE_WINDOW);
        tabCache.removeActive();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
        console.log(keypressService.EVENTS.MOVE_LEFT);
        tabCache.activatePrevious();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
        console.log(keypressService.EVENTS.MOVE_RIGHT);
        tabCache.activateNext();
      });

      keypressService.registerCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER, function() {
        console.log(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
        $rootScope.showConnections();
      });
    }
  ]);
