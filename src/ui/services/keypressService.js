'use strict';

angular.module('app').factory('keypressService', [
  '$window',
  '$rootScope',
  '$log',
  '$timeout', ($window, $rootScope, $log, $timeout) => {
    const keybindings = require('lib/modules/keybindings');

    function KeypressService() {
      let _this = this;
      _this.registeredCombos = {};
      _this.registeredCommandHandlers = {};
      _this.listener = new $window.keypress.Listener();
      _this.keybindingContext = null;

      keybindings.list()
        .then((keybindings) => {
          $timeout(() => {
            let keybindingGroups = _.groupBy(keybindings, 'keystroke');

            for (let key in keybindingGroups) {
              let bindings = keybindingGroups[key];

              _.each(bindings, (binding) => {
                let commandHandler = _this.registeredCommandHandlers[binding.command];

                if (!commandHandler) {
                  $log.warn('KeypressService - constructor - no command handler registered for command : ' + binding.command);
                } else {
                  _this.registerCombo(key, binding.context, commandHandler);
                }
              }); // jshint ignore:line
            }
          });
        })
        .catch((err) => {
          $timeout(() => {
            $log.error(err);
          });
        });
    }

    KeypressService.prototype.isRegistered = function isRegistered(combo) {
      let registration = this.registeredCombos[combo];
      return registration ? true : false;
    };

    KeypressService.prototype.registerCombo = function registerCombo(combo, context, callback) {
      let _this = this;

      if (!combo || !context || !callback || !_.isFunction(callback)) return;

      //can only register a combo 1 time per context
      //you can have multiple registrations per combo, as long as the contexts are different
      //since we should only ever fire one handler for any given context

      //if the combo is already registered just add the listener
      if (_this.isRegistered(combo)) {
        let registeredCallback = _.findWhere(_this.registeredCombos[combo], {
          context: _this.keybindingContext
        });

        if (registeredCallback) {
          throw new Error('registerCombo - combo has already been registered for the given context - can only have 1 callback per key combo');
        } else {
          let callbacks = _this.registeredCombos[combo];
          callbacks.push(callback);
        }
      }
      //otherwise register the combo with a wrapper that will fire any registered callbacks that match
      //the current keybindingContext
      else {
        let callbackWrapper = () => {
          console.log('keybindingContext', _this.keybindingContext);

          let args = Array.prototype.slice.call(arguments);

          let callbacks = _this.registeredCombos[combo];
          let registeredCallbacks = _.filter(callbacks, (callback) => {
            return callback.context === _this.keybindingContext || callback.context === 'global';
          });

          if (registeredCallbacks && registeredCallbacks.length) {
            _.each(registeredCallbacks, (cb) => {
              cb.callback.call(args);
              $rootScope.$apply();
            });
          }
        };

        _this.registeredCombos[combo] = [{
          context: context,
          callback: callback
        }];

        $log.debug('Registering keypress combo : ' + combo);

        _this.listener.counting_combo(convertCommand(combo), callbackWrapper, true); // jshint ignore:line
      }
    };

    KeypressService.prototype.unregisterCombo = function unregisterCombo(combo) {
      this.listener.unregister_combo(combo); // jshint ignore:line
    };

    KeypressService.prototype.unregisterAllCombos = function unregisterAllCombos() {
      let _this = this;

      _.each(_this.registeredCombos, (combo) => {
        _this.listener.unregister_combo(combo); // jshint ignore:line
      });
    };

    KeypressService.prototype.changeCurrentContext = function changeCurrentContext(context) {
      if (!context) return;

      $log.debug('keybinding context changed', context);

      this.keybindingContext = context;
    };

    KeypressService.prototype.registerCommandHandler = function registerCommandHandler(command, callback) {
      if (!command || !callback) return;

      let _this = this;

      if (_this.registeredCommandHandlers[command]) throw new Error('registerCommandHandler - command \'' + command + '\' is already registerd');

      _this.registeredCommandHandlers[command] = callback;
    };

    function convertCommand(command) {
      command = command.replace(/cmd/g, 'meta');
      command = command.replace(/-/g, ' ');

      return command;
    }

    return new KeypressService();
  }
]);

angular.module('app').run([
  '$rootScope',
  'keypressService', ($rootScope, keypressService) => {
    $rootScope.$on('$destroy', () => {
      keypressService.unregisterAllCombos();
    });
  }
]);
