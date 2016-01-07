angular.module('app').run([
  'keypressService',
  'tabCache',
  function(keypressService, tabCache) {
    keypressService.registerCommandHandler('tab-manager:new-tab', function() {
      var activeTab = tabCache.getActive();

      if (activeTab && activeTab.type !== tabCache.TYPES.PAGE) {
        var newTab = {};
        newTab.name = activeTab.name;
        newTab.type = activeTab.type;
        newTab.collection = activeTab.collection;
        newTab.defaultCollection = activeTab.defaultCollection;
        newTab.database = activeTab.database;
        newTab = tabCache.add(newTab);

        tabCache.activateById(newTab.id);
      }
    });
  }
]);
