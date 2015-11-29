angular.module('app').directive('themeClass', [
  'themeService',
  function(themeService) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var currentTheme = themeService.currentTheme;

        if (currentTheme) element.addClass('theme-' + currentTheme.name);

        themeService.on(themeService.EVENTS.THEME_CHANGED, function() {
          if (currentTheme) element.removeClass('theme-' + currentTheme.name);

          currentTheme = themeService.currentTheme;

          if (currentTheme) element.addClass('theme-' + currentTheme.name);
        });
      }
    };
  }
]);
