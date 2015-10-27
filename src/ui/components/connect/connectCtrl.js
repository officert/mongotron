'use strict';

angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$modalInstance',
  '$log',
  'alertService',
  'connectionCache',
  function($scope, $rootScope, $timeout, $modalInstance, $log, alertService, connectionCache) {
    const connectionModule = require('lib/modules/connection');

    $scope.setTitle('MongoDb Connections');

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

    $scope.screens = {
      LIST: {
        name: 'Manage Your Connections',
        slug: 'LIST'
      },
      ADD: {
        name: 'Add a New Connection',
        slug: 'ADD'
      },
      EDIT: {
        name: 'Connection Settings',
        slug: 'EDIT'
      },
      REMOVE: {
        name: 'Remove Connection',
        slug: 'REMOVE'
      }
    };
    $scope.currentScreen = $scope.screens.LIST;
    $scope.selectedConnection = null;

    $scope.addConnectionForm = {
      auth: {}
    };
    $scope.addConnectionFormSubmitted = false;

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.isConnected = function(connection) {
      if (!connection) return false;

      return connectionCache.exists(connection);
    };

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if (!connectionCache.exists(connection)) {
        connectionCache.add(connection);
      } else {
        connectionCache.remove(connection);
      }
    };

    $scope.changeScreen = function(screen, connection, $event) {
      if ($event) $event.preventDefault();
      $scope.currentScreen = screen;
      $scope.selectedConnection = connection;
    };

    $scope.addConnection = function(addConnectionForm) {
      $scope.addConnectionFormSubmitted = true;

      if (!addConnectionForm.$valid) return;

      connectionModule.create($scope.addConnectionForm)
        .then(function(connection) {
          $timeout(function() {
            $scope.connections.push(connection);

            $scope.currentScreen = $scope.screens.LIST;

            alertService.success('Connection added');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            alertService.error(err);
            console.log(err);
          });
        });
    };

    $scope.editConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();
    };

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      connectionModule.delete(connection.id)
        .then(function() {
          $timeout(function() {
            var index = $scope.connections.indexOf(connection);

            if (index >= 0) $scope.connections.splice(index, 1);

            $scope.currentScreen = $scope.screens.LIST;

            alertService.success('Connection removed');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            alertService.error(err);
            console.log(err);
          });
        });
    };
  }
]);
