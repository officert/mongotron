angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'connectionService',
  '$log',
  'alertService',
  function($scope, $rootScope, $modalInstance, connectionService, $log, alertService) {
    $scope.setTitle('MongoDb Connections');

    $scope.connections = [];

    connectionService.list()
      .then(function(connections) {
        $scope.connections = connections;
      })
      .catch(function(response) {
        $log.error(response);
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

    $scope.addConnectionForm = {};
    $scope.addConnectionFormSubmitted = false;

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.isConnected = function(connection) {
      if (!connection) return false;

      var foundConnection = getActiveConnectionById(connection.id);

      return foundConnection ? true : false;
    };

    $scope.disconnect = function(connection) {
      if (!connection) return false;

      removeActiveConnectionById(connection.id);
    };

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if (!$scope.isConnected(connection)) {
        $rootScope.currentConnections.push(connection);
      } else {
        $scope.disconnect(connection);
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

      connectionService.create($scope.addConnectionForm)
        .then(function(connection) {
          $scope.connections.push(connection);
          $scope.currentScreen = $scope.screens.LIST;

          alertService.success('Connection added');
        })
        .catch(function(err) {
          alertService.error(err);
          console.log(err);
        });
    };

    $scope.editConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();
    };

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      if ($scope.isConnected(connection)) {
        $scope.disconnect(connection);
      }

      connectionService.delete(connection.id)
        .then(function() {
          var foundConnection = _.findWhere($scope.connections, {
            id: connection.id
          });

          if (foundConnection) {
            var index = $scope.connections.indexOf(foundConnection);
            $scope.connections.splice(index, 1);
          }

          $scope.currentScreen = $scope.screens.LIST;

          alertService.success('Connection removed');
        })
        .catch(function(err) {
          alertService.error(err);
          console.log(err);
        });
    };

    function getActiveConnectionById(id) {
      return _.findWhere($rootScope.currentConnections, {
        id: id
      });
    }

    function removeActiveConnectionById(id) {
      var foundConnection = getActiveConnectionById(id);

      if (foundConnection) {
        var index = $rootScope.currentConnections.indexOf(foundConnection);
        $rootScope.currentConnections.splice(index, 1);
      }

      removeActiveCollectionsByConnectionId(id);
    }

    function removeActiveCollectionsByConnectionId(id) {
      $rootScope.currentCollections = _.filter($rootScope.currentCollections, function(collection) {
        return collection.connection.id !== id;
      });
    }
  }
]);
