'use strict';

angular.module('app').controller('appCtrl', [
  '$scope',
  'modalService',
  'tabCache',
  'navUtils',
  ($scope, modalService, tabCache, navUtils) => {
    $scope.currentQuery = null;
    $scope.showConnections = showConnections;
    $scope.showSettings = showSettings;
    $scope.showAbout = showAbout;

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
  }
]);
