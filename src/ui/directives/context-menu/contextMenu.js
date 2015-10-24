angular.module('app').directive('contextMenu', [
  function() {
    return {
      restrict: 'A',
      controller: 'contextMenuCtrl',
      scope: {
        contextMenu: '=',
        contextMenuName: '=',
        contextMenuArgs: '='
      }
    };
  }
]);
