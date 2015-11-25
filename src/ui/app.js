'use strict';

var ipc = require('ipc');

angular.module('app', [
  'ui.bootstrap',
  'ngAnimate',
  'ui.sortable',
  'ngSanitize',
  'duScroll',
  'ngPrettyJson',
  'autoGrowInput'
]);

angular.module('app').run([
  '$rootScope',
  '$log',
  'modalService',
  'tabCache',
  function($rootScope, $log, modalService, tabCache) {
    const pageTitle = 'Mongotron';

    $rootScope.themes = initThemes();
    $rootScope.setTitle = setTitle;
    $rootScope.currentQuery = null;
    $rootScope.showConnections = showConnections;
    $rootScope.showSettings = showSettings;

    setTitle(pageTitle);

    showConnections();

    $rootScope.showLogs = function($event) {
      if ($event) $event.preventDefault();

      var logsTabName = 'Logs';

      if (!tabCache.existsByName(logsTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-cog',
          name: logsTabName,
          src: __dirname + '/components/logs/logs.html'
        });
      } else {
        tabCache.activateByName(logsTabName);
      }
    };

    function initThemes() {
      return {
        //current: 'default',
        // current: 'isotope-ui',
        current: 'atom'
      };
    }

    function showConnections(state, $event) {
      if ($event) $event.preventDefault();

      modalService.openConnectionManager(state)
        .result
        .then(function() {
          $rootScope.setTitle(pageTitle);
        });
    }

    function showSettings($event) {
      if ($event) $event.preventDefault();

      var settingsTabName = 'Settings';

      if (!tabCache.existsByName(settingsTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-cog',
          name: settingsTabName,
          src: __dirname + '/components/settings/settings.html'
        });
      } else {
        tabCache.activateByName(settingsTabName);
      }
    }

    function setTitle(title) {
      ipc.send('set-title', title);
    }
  }
]);
