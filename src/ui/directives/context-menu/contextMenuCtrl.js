angular.module('app').controller('contextMenuCtrl', [
  '$scope',
  'menuService',
  function($scope, menuService) {
    var args = $scope.contextMenuArgs;

    _.each($scope.contextMenu, function(menuItem) {
      var ogClick = menuItem.click;

      menuItem.click = function() {
        var fnArgs = Array.prototype.slice.call(arguments);

        args = args.concat(fnArgs);

        ogClick.apply(this, args);
      };
    });

    menuService.registerContextMenu($scope.contextMenuName, $scope.contextMenu);
  }
]);
