'use strict';

const ipc = require('ipc');

const urlHelpers = require('lib/helpers/urlHelpers');

angular.module('app', [
  'ngResource',
  'ui.bootstrap',
  'ngAnimate',
  'ngSanitize',
  'duScroll',
  'ngPrettyJson'
]);

angular.module('app').run([
  '$rootScope',
  '$log',
  '$timeout',
  'alertService',
  'keypressService',
  'modalService',
  'tabCache',
  'queryCache',
  function AppCtrl($rootScope, $log, $timeout, alertService, keypressService, modalService, tabCache, queryCache) {
    $rootScope.meta = {
      title: 'Mongotron'
    };

    registerKeypressEvents();

    $rootScope.themes = initThemes();

    $rootScope.getBrowserUrl = function(url) {
      return urlHelpers.getBrowserUrl(url);
    };

    $rootScope.setTitle = function(title) {
      ipc.send('set-title', title);
    };

    var pageTitle = 'Mongotron';
    $rootScope.setTitle(pageTitle);

    $rootScope.activateNextQueryWindow = function() {
      queryCache.activateNext();
    };

    $rootScope.showConnections = function($event) {
      if ($event) $event.preventDefault();
      modalService.openConnectionManager()
        .then(function() {
          $rootScope.setTitle(pageTitle);
        });
    };

    $rootScope.showSettings = function($event) {
      if ($event) $event.preventDefault();

      tabCache.add({
        name: 'Settings',
        src: __dirname + '/components/settings/settings.html'
      });
    };

    function registerKeypressEvents() {
      // unregister keypress events on scope destroy
      $rootScope.$on('$destroy', function() {
        keypressService.unregisterCombo(keypressService.EVENTS.CLOSE_WINDOW);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_LEFT);
        keypressService.unregisterCombo(keypressService.EVENTS.MOVE_RIGHT);
        keypressService.unregisterCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
      });

      keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
        console.log(keypressService.EVENTS.CLOSE_WINDOW);
        queryCache.removeActive();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
        console.log(keypressService.EVENTS.MOVE_LEFT);
        queryCache.activatePrevious();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
        console.log(keypressService.EVENTS.MOVE_RIGHT);
        queryCache.activateNext();
      });

      keypressService.registerCombo(keypressService.EVENTS.OPEN_CONNECTION_MANAGER, function() {
        console.log(keypressService.EVENTS.OPEN_CONNECTION_MANAGER);
        $rootScope.showConnections();
      });
    }

    function initThemes() {
      return {
        //current: 'default'
        current: 'isotope-ui'
      };
    }
  }
]);
