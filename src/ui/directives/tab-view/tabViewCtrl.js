angular.module('app').controller('tabViewCtrl', [
  '$scope',
  'tabCache',
  'EVENTS',
  '$timeout',
  function($scope, tabCache, EVENTS, $timeout) {
    $scope.tabs = tabCache.list();

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
          var tabId = angular.element(ui.item).attr('tab-id');

          if (!tabId) return;

          tabCache.activateById(tabId);
        });
      }
    };

    tabCache.on(EVENTS.TAB_CACHE_CHANGED, function(updatedCache) {
      $scope.tabs = updatedCache;
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
