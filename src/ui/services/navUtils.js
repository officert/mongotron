'use strict';

angular.module('app').factory('navUtils', [
  'modalService',
  'tabCache',
  'utilsService',
  function(modalService, tabCache, utilsService) {
    const Promise = require('bluebird');

    function NavUtils() {}

    NavUtils.prototype.showConnections = function(page) {
      utilsService.setTitle('Select a connection');

      return new Promise((resolve, reject) => {
        modalService.openConnectionManager(page).result
          .then(resolve)
          .catch(reject)
          .finally(() => {
            utilsService.setTitle('Mongotron');
          });
      });
    };

    NavUtils.prototype.showSettings = function() {
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
    };

    NavUtils.prototype.showAbout = function() {
      var aboutTabName = 'About';

      if (!tabCache.existsByName(aboutTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-info-circle',
          name: aboutTabName,
          src: __dirname + '/components/about/about.html'
        });
      } else {
        tabCache.activateByName(aboutTabName);
      }
    };

    NavUtils.prototype.showLogs = function() {
      var logsTabName = 'Logs';

      if (!tabCache.existsByName(logsTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-info-circle',
          name: logsTabName,
          src: __dirname + '/components/logs/logs.html'
        });
      } else {
        tabCache.activateByName(logsTabName);
      }
    };

    return new NavUtils();
  }
]);
