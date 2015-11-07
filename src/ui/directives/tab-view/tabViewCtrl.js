angular.module('app').controller('tabViewCtrl', [
  '$scope',
  'tabCache',
  'connectionCache',
  'EVENTS',
  '$timeout',
  function($scope, tabCache, connectionCache, EVENTS, $timeout) {
    $scope.tabs = tabCache.list();
    $scope.connections = connectionCache.list();

    $scope.TAB_TYPES = tabCache.TYPES;

    $scope.sortableOptions = {
      //http://api.jqueryui.com/sortable
      placeholder: 'sortable-placeholder',
      delay: 150,
      appendTo: 'body',
      revert: 50,
      helper: function(e, item) {
        $timeout(function() {
          //force the element to show, race condition :(
          item.attr('style', 'display: block !important');
        });
        return item.clone();
      },
      // helper: 'clone',
      opacity: 1,
      tolerance: 'intersect',
      stop: function(event, ui) {
        $timeout(function() {
          //activate the dropped tab
          var tabId = angular.element(ui.item).attr('tab-id');

          if (!tabId) return;

          tabCache.activateById(tabId);
        });
      }
    };

    tabCache.on(EVENTS.TAB_CACHE_CHANGED, function(updatedCache) {
      $scope.tabs = updatedCache;
    });

    connectionCache.on(EVENTS.CONNECTION_CACHE_CHANGED, function(updatedCache) {
      $scope.connections = updatedCache;
    });

    $scope.activateTab = function(tab, $event) {
      if ($event) $event.preventDefault();

      if (tab.active) return;
      else {
        tabCache.deactivateAll();
        tab.active = true;
      }
    };

    $scope.closeTab = function(tab, $event) {
      if ($event) $event.preventDefault();

      tabCache.remove(tab);
    };
  }
]);
