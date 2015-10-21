'use strict';

const ipc = require('ipc');

const UrlHelpers = require('lib/helpers/urlHelpers');

angular.module('app', [
  'ngResource',
  'ui.bootstrap',
  'ngAnimate',
  'ngSanitize',
  'duScroll',
  'ngPrettyJson'
]);

angular.module('app').constant('appConfig', {
  VERSION: '@@VERSION',
  ENV: '@@ENV'
});

angular.module('app').run([
  '$rootScope',
  '$log',
  '$timeout',
  'alertService',
  'keypressService',
  'modalService',
  function AppCtrl($rootScope, $log, $timeout, alertService, keypressService, modalService) {
    $rootScope.tabs = [];
    $rootScope.currentConnections = [];
    $rootScope.currentCollections = []; //collections stored while user is querying

    $rootScope.meta = {
      title: 'Mongotron'
    };

    registerKeypressEvents();

    $rootScope.themes = initThemes();

    $rootScope.getBrowserUrl = function(url) {
      return UrlHelpers.getBrowserUrl(url);
    };

    $rootScope.setTitle = function(title) {
      ipc.send('set-title', title);
    };

    var pageTitle = 'Mongotron';
    $rootScope.setTitle(pageTitle);

    $rootScope.closeActiveCollectionWindow = function() {
      var activeCollection = _.findWhere($rootScope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        activeCollection.active = false;
        var index = $rootScope.currentCollections.indexOf(activeCollection);
        $rootScope.currentCollections.splice(index, 1);
      }
    };

    $rootScope.activatePreviousCollectionWindow = function() {
      if ($rootScope.currentCollections.length === 1) return;

      var activeCollection = _.findWhere($rootScope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        var index = $rootScope.currentCollections.indexOf(activeCollection);
        var previousCollection = index === 0 ? $rootScope.currentCollections[$rootScope.currentCollections.length - 1] : $rootScope.currentCollections[index - 1];
        previousCollection.active = true;
        activeCollection.active = false;
      }
    };

    $rootScope.activateNextCollectionWindow = function() {
      if ($rootScope.currentCollections.length === 1) return;

      var activeCollection = _.findWhere($rootScope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        var index = $rootScope.currentCollections.indexOf(activeCollection);
        var nextCollection = (index === ($rootScope.currentCollections.length - 1)) ? $rootScope.currentCollections[0] : $rootScope.currentCollections[index + 1];
        nextCollection.active = true;
        activeCollection.active = false;
      }
    };

    $rootScope.showConnections = function($event) {
      if ($event) $event.preventDefault();
      modalService.openConnectionManager()
        .then(function() {
          $rootScope.setTitle(pageTitle);
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
        $rootScope.closeActiveCollectionWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
        console.log(keypressService.EVENTS.MOVE_LEFT);
        $rootScope.activatePreviousCollectionWindow();
      });

      keypressService.registerCombo(keypressService.EVENTS.MOVE_RIGHT, function() {
        console.log(keypressService.EVENTS.MOVE_RIGHT);
        $rootScope.activateNextCollectionWindow();
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
