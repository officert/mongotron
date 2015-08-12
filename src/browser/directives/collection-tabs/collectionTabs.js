angular.module('app').directive('collectionTabs', [
  '$rootScope',
  function($rootScope) {
    return {
      restrict: 'E',
      templateUrl: __dirname + '/directives/collection-tabs/collectionTabs.html',
      controller: 'collectionTabsCtrl',
      scope: {
        collections: '='
      }
    };
  }
]);
