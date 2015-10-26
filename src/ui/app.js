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
  function AppCtrl($rootScope, $log, $timeout, alertService, keypressService, modalService) {
    $rootScope.currentTabs = [];
    $rootScope.currentConnections = []; //active connections
    $rootScope.currentQueries = []; //active queries

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

    $rootScope.closeActiveQueryWindow = function() {
      var activeQuery = _.findWhere($rootScope.currentQueries, {
        active: true
      });

      if (activeQuery) {
        activeQuery.active = false;
        var index = $rootScope.currentQueries.indexOf(activeQuery);
        $rootScope.currentQueries.splice(index, 1);
      }
    };

    $rootScope.activatePreviousQueryWindow = function() {
      if ($rootScope.currentQueries.length === 1) return;

      var activeQuery = _.findWhere($rootScope.currentQueries, {
        active: true
      });

      if (activeQuery) {
        var index = $rootScope.currentQueries.indexOf(activeQuery);
        var previousQuery = index === 0 ? $rootScope.currentQueries[$rootScope.currentQueries.length - 1] : $rootScope.currentQueries[index - 1];
        previousQuery.active = true;
        activeQuery.active = false;
      }
    };

    $rootScope.activateNextQueryWindow = function() {
      if ($rootScope.currentQueries.length === 1) return;

      var activeQuery = _.findWhere($rootScope.currentQueries, {
        active: true
      });

      if (activeQuery) {
        var index = $rootScope.currentQueries.indexOf(activeQuery);
        var nextQuery = (index === ($rootScope.currentQueries.length - 1)) ? $rootScope.currentQueries[0] : $rootScope.currentQueries[index + 1];
        nextQuery.active = true;
        activeQuery.active = false;
      }
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

      $rootScope.currentTabs.push({
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
        $rootScope.closeActiveQueryWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
        console.log(keypressService.EVENTS.MOVE_LEFT);
        $rootScope.activatePreviousQueryWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
        console.log(keypressService.EVENTS.MOVE_RIGHT);
        $rootScope.activateNextQueryWindow();
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
