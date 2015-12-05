'use strict';

const ipcRenderer = require('electron').ipcRenderer;

angular.module('app').controller('appCtrl', [
  '$scope',
  '$log',
  'modalService',
  'tabCache',
  'navUtils',
  function($scope, $log, modalService, tabCache, navUtils) {
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

      navUtils.showConnections(page);
    }

    function showSettings($event) {
      if ($event) $event.preventDefault();

      navUtils.showSettings();
    }

    function showAbout($event) {
      if ($event) $event.preventDefault();

      navUtils.showAbout();
    }

    function setTitle(title) {
      ipcRenderer.send('set-title', title);
    }
  }
]);
