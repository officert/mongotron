'use strict';

angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$timeout',
  '$modalInstance',
  '$log',
  'alertService',
  'connectionCache',
  'state',
  function($scope, $rootScope, $timeout, $modalInstance, $log, alertService, connectionCache, state) {
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
    $scope.currentScreen = state && $scope.screens[state] ? $scope.screens[state] : $scope.screens.LIST;
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

      return connectionCache.existsByName(connection.name);
    };

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if (!$scope.isConnected(connection)) {
        connectionCache.add(connection);
      } else {
        connectionCache.removeById(connection.id);
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

    $scope.editConnection = function(editConnectionForm) {
      if (!editConnectionForm.$valid) return;

      connectionModule.update($scope.selectedConnection.id, $scope.selectedConnection)
        .then(function(connection) {
          $timeout(function() {
            connectionCache.updateById($scope.selectedConnection.id, connection);

            $scope.selectedConnection = _.extend($scope.selectedConnection, connection);

            $scope.currentScreen = $scope.screens.LIST;

            alertService.success('Connection updated');
          });
        })
        .catch(function(err) {
          $timeout(function() {
            alertService.error(err);
            console.log(err);
          });
        });
    };

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      connectionModule.delete(connection.id)
        .then(function() {
          $timeout(function() {
            var index = $scope.connections.indexOf(connection);

            if (index >= 0) $scope.connections.splice(index, 1);

            connectionCache.removeById(connection.id);

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
