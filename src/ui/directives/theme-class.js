angular.module('app').directive('themeClass', [
  'themeService',
  function(themeService) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var currentTheme = themeService.currentTheme;

        element.addClass('theme-' + currentTheme);

        themeService.on(themeService.EVENTS.THEME_CHANGED, function() {
          element.removeClass('theme-' + currentTheme);

          currentTheme = themeService.currentTheme;

          element.addClass('theme-' + currentTheme);
        });
      }
    };
  }
]);
