angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'connectionService',
  '$log',
  'alertService',
  function($scope, $rootScope, $modalInstance, connectionService, $log, alertService) {
    $scope.setTitle('MongoDb Connections');

    $scope.screens = {
      LIST: 'LIST',
      ADD: 'ADD',
      EDIT: 'EDIT',
      REMOVE: 'REMOVE'
    };
    $scope.currentScreen = $scope.screens.LIST;
    $scope.selectedConnection = null;

    $scope.connections = [];

    connectionService.list()
      .then(function(connections) {
        $scope.connections = connections;
      })
      .catch(function(response) {
        $log.error(response);
      });

    $scope.close = function() {
      $modalInstance.close(1);
    };

    $scope.isConnected = function(connection) {
      if (!connection) return false;

      var existingConnection = _.findWhere($rootScope.currentConnections, {
        name: connection.name
      });

      return existingConnection ? true : false;
    };

    $scope.disconnect = function(connection) {
      if (!connection) return false;

      var index = $rootScope.currentConnections.indexOf(connection);

      if (index >= 0) {
        $rootScope.currentConnections.splice(index, 1);
      }
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

    $scope.changeScreen = function(screenName, connection, $event) {
      if ($event) $event.preventDefault();
      $scope.currentScreen = screenName;
      $scope.selectedConnection = connection;
    };

    $scope.addConnection = function() {

    };

    $scope.editConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();
    };

    $scope.removeConnection = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      connectionService.delete(connection.id)
        .then(function(connections) {
          $rootScope.currentConnections = connections;
          $scope.currentScreen = $scope.screens.LIST;
          alertService.success('Connection removed');
        })
        .catch(function(err) {
          console.log(err);
        });
    };
  }
]);
