angular.module('app').factory('keypressService', [
  '$window',
  '$rootScope',
  function($window, $rootScope) {

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
        this.unregisterCombo(combo);
      }
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
      MOVE_LEFT: 'meta shift }'
    };

    return new KeypressService();
  }
]);
