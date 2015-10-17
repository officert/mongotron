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
  }
]);
