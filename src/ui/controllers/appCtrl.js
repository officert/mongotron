'use strict';

const ipcRenderer = require('electron').ipcRenderer;

angular.module('app').controller('appCtrl', [
  '$scope',
  '$log',
  'modalService',
  'tabCache',
  function($scope, $log, modalService, tabCache) {
    const pageTitle = 'Mongotron';

    $scope.setTitle = setTitle;
    $scope.currentQuery = null;
    $scope.showConnections = showConnections;
    $scope.showSettings = showSettings;
    $scope.showAbout = showAbout;

    setTitle(pageTitle);

    showConnections();

    $scope.showLogs = function($event) {
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

    function showConnections(page, $event) {
      if ($event) $event.preventDefault();

      modalService.openConnectionManager(page)
        .result
        .then(function() {
          $scope.setTitle(pageTitle);
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

    function showAbout($event) {
      if ($event) $event.preventDefault();

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
    }

    function setTitle(title) {
      ipcRenderer.send('set-title', title);
    }
  }
]);
