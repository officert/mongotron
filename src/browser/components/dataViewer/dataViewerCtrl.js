angular.module('app').controller('dataViewerCtrl', [
  '$scope',
  '$rootScope',
  '$log',
  '$state',
  '$timeout',
  'alertService',
  'keypressService',
  'modalService',
  function($scope, $rootScope, $log, $state, $timeout, alertService, keypressService, modalService) {
    $scope.setTitle('Mongotron Data Viewer');

    $scope.currentCollections = []; //collections stored while user is querying

    keypressService.registerCombo(keypressService.EVENTS.CLOSE_WINDOW, function() {
      console.log(keypressService.EVENTS.CLOSE_WINDOW);
      $scope.closeActiveCollectionWindow();
    });

    keypressService.registerCombo(keypressService.EVENTS.MOVE_LEFT, function() {
      console.log(keypressService.EVENTS.MOVE_LEFT);
    });

    // unregister keypress events on scope destroy
    $scope.$on('$destroy', function() {
      keypressService.unregisterCombo(keypressService.EVENTS.CLOSE_WINDOW);
    });

    $scope.closeActiveCollectionWindow = function() {
      var activeCollection = _.findWhere($scope.currentCollections, {
        active: true
      });

      if (activeCollection) {
        activeCollection.active = false;
        var index = $scope.currentCollections.indexOf(activeCollection);
        $scope.currentCollections.splice(index, 1);
      }
    };

    $scope.showConnections = function($event) {
      if($event) $event.preventDefault();
      modalService.connections();
    };
  }
]);
