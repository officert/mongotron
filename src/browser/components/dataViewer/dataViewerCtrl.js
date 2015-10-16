angular.module('app').controller('dataViewerCtrl', [
  '$scope',
  '$rootScope',
  '$log',
  '$state',
  '$timeout',
  'alertService',
  'keypressService',
  function($scope, $rootScope, $log, $state, $timeout, alertService, keypressService) {
    $scope.setTitle('Mongotron Data Viewer');

    $scope.windowFocus = {

    };

    keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
      console.log(keypressService.EVENTS.CLOSE_WINDOW);
      $scope.closeActiveCollectionWindow();
    });

    keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
      console.log(keypressService.EVENTS.MOVE_LEFT);
    });

    // * on scope destroy
    $scope.$on('$destroy', function() {
      keypressService.unregisterCombo(keypressService.EVENTS.CLOSE_WINDOW);
    });

    $scope.currentCollections = []; //collections stored while user is querying

    if (!$scope.currentConnections || !$scope.currentConnections.length) {
      $state.go('connect');
      return;
    } else {
      //collapse any accordions levels on view load
      _.each($scope.currentConnections, function(connection) {
        _collapseConnection(connection);
      });
    }

    // sidebar accordion functionality
    function _collapseConnection(connection) {
      connection.isOpen = false;

      _.each(connection.databases, function(database) {
        _collapseDatabase(database);
      });
    }

    function _collapseDatabase(database) {
      database.isOpen = false;
    }

    $scope.openConnection = function(connection) {
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
          }, 500);
        });
      } else {
        _collapseDatabase(database);
      }

      database.showFolders = !database.showFolders;
    };

    $scope.listDatabaseCollections = function listDatabaseCollections(database) {
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
          }, 500);
        });
      }

      database.showCollections = !database.showCollections;

      $scope.activateItem(database);
    };

    // content view tabs functionality
    $scope.loadCollection = function loadCollection(collection) {
      $scope.collections.push(collection);
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
  }
]);
