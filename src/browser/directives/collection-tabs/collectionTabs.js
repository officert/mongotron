angular.module('app').directive('collectionTabs', [
  function() {
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
