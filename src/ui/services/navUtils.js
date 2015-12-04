angular.module('app').factory('navUtils', [
  'modalService',
  'tabCache',
  function(modalService, tabCache) {

    function NavUtils() {}

    NavUtils.prototype.showConnections = function(page) {
      return modalService.openConnectionManager(page).result;
    };

    NavUtils.prototype.showSettings = function() {
      var settingsTabName = 'Settings';

      if (!tabCache.existsByName(settingsTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-cog',
          name: settingsTabName,
          src: __dirname + '/components/settings/settings.html'
        });
      } else {
        tabCache.activateByName(settingsTabName);
      }
    };

    NavUtils.prototype.showAbout = function() {
      var aboutTabName = 'About';

      if (!tabCache.existsByName(aboutTabName)) {
        tabCache.add({
          type: tabCache.TYPES.PAGE,
          iconClassName: 'fa fa-info-circle',
          name: aboutTabName,
          src: __dirname + '/components/about/about.html'
        });
      } else {
        tabCache.activateByName(aboutTabName);
      }
    };

    return new NavUtils();
  }
]);
