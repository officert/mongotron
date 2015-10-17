angular.module('app').controller('sidebarCtrl', [
  '$scope',
  '$timeout',
  'alertService',
  '$state',
  function($scope, $timeout, alertService, $state) {
    if (!$scope.currentConnections || !$scope.currentConnections.length) {
      $state.go('connect');
      return;
    } else {
      //collapse any accordions levels on view load
      _.each($scope.currentConnections, function(connection) {
        _collapseConnection(connection);
      });
    }

    //connections
    $scope.openConnection = function openConnection(connection) {
      if (!connection) return;

      if (!connection.isOpen) {
        connection.connect(function(err) {
          $timeout(function() {
            if (err) {
              alertService.error(err);
              connection.isOpen = false;
            } else {
              connection.isOpen = true;
            }
          });
        });
      } else {
        _collapseConnection(connection);
      }
    };

    $scope.openDatabase = function openDatabase(database) {
      if (!database) return;

      if (!database.isOpen) {
        database.opening = true;
        database.open(function(err) {
          $timeout(function() {
            database.opening = false;

            if (err) {
              return alertService.error(err);
            }

            database.isOpen = true;
          });
        });
      } else {
        _collapseDatabase(database);
      }

      database.showFolders = !database.showFolders;
    };

    $scope.openCollections = function openCollections(database) {
      if (!database) return;

      if (!database.collections || !database.collections.length) {
        database.loadingCollections = true;
        database.listCollections(function(err, collections) {
          $timeout(function() {
            database.loadingCollections = false;

            if (err) {
              return alertService.error(err);
            }

            database.collections = collections.map(function(collection) {
              collection.databaseName = database.name;
              collection.databaseHost = database.host;
              collection.databasePort = database.port;
              return collection;
            });
          });
        });
      }

      database.showCollections = !database.showCollections;

      $scope.activateItem(database);
    };

    $scope.activateItem = function activateItem(item, type) {
      if ($scope.currentActiveItem) {
        $scope.currentActiveItem.active = false;
      }
      $scope.currentActiveItem = item;
      $scope.currentActiveItem.active = true;

      switch (type) {
        case 'collection':
          _addCollection(item);
          break;
      }
    };

    $scope.closeActiveCollectionWindow = function() {
      var activeCollection = _.findWhere($scope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        var index = $scope.currentCollections.indexOf(activeCollection);
        $scope.currentCollections.splice(index, 1);
      }
    };

    function _addCollection(collection) {
      if (!collection) return;

      var existingCollection = _.findWhere($scope.currentCollections, {
        databaseName: collection.databaseName,
        name: collection.name
      });

      if (!existingCollection) $scope.currentCollections.push(collection);

      $state.go('data-viewer.collections');
    }

    function _collapseConnection(connection) {
      connection.isOpen = false;

      _.each(connection.databases, function(database) {
        _collapseDatabase(database);
      });
    }

    function _collapseDatabase(database) {
      database.isOpen = false;
    }
  }
]);
