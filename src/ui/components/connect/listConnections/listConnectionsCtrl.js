'use strict';

angular.module('app').controller('listConnectionsCtrl', [
  '$scope',
  '$timeout',
  '$log',
  'connectionCache',
  function($scope, $timeout, $log, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.connections = [];

    connectionModule.list()
      .then(function(connections) {
        $timeout(function() {
          $scope.connections = connections;
        });
      })
      .catch(function(response) {
        $timeout(function() {
          $log.error(response);
        });
      });

    $scope.selectConnection = function(connection, $event) {
      if (!connection) return false;
      if ($event) $event.preventDefault();

      if (connection.selected) {
        connection.selected = false;
        return;
      }

      _.each($scope.connections, function(conn) {
        conn.selected = false;
      });

      connection.selected = true;
    };

    $scope.connectionSelected = function() {
      return _.any($scope.connections, function(conn) {
        return conn.selected;
      });
    };

    $scope.connect = function($event) {
      if ($event) $event.preventDefault();

      var activeConnection = _.findWhere($scope.connections, {
        selected: true
      });

      if (!activeConnection) return;

      connectionCache.add(activeConnection);

      $scope.close();
    };
  }
]);
