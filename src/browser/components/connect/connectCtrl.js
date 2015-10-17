angular.module('app').controller('connectCtrl', [
  '$scope',
  '$rootScope',
  'connectionService',
  '$log',
  '$state',
  function($scope, $rootScope, connectionService, $log, $state) {
    $scope.setTitle('MongoDb Connections');

    connectionService.list()
      .then(function(connections) {
        $scope.connections = connections;
      })
      .catch(function(response) {
        $log.error(response);
      });

    $scope.connect = function(connection, $event) {
      if (!connection) return;
      if ($event) $event.preventDefault();

      var existingConnection = _.findWhere($rootScope.currentConnections, {
        name: connection.name
      });

      if (!existingConnection) {
        $rootScope.currentConnections.push(connection);
      }

      $state.go('data-viewer');
    };
  }
]);
