'use strict';

angular.module('app').directive('themeClass', [
  'themeService', (themeService) => {
    return {
      restrict: 'A',
      link: (scope, element) => {
        let currentTheme = themeService.currentTheme;

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
