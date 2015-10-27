'use strict';

angular.module('app').factory('menuService', [
  '$window',
  function($window) {
    const remote = require('remote');
    const Menu = remote.require('menu');
    const MenuItem = remote.require('menu-item');

    let MENU_CACHE = {};

    function MenuService() {
      $window.addEventListener('contextmenu', (e) => {
        var $el = angular.element(e.srcElement);
        var menuName = $el.attr('context-menu-name');

        if (!menuName) return;

        if (menuName[0] === '\'') {
          menuName = menuName.substr(1);
        }
        if (menuName[menuName.length - 1] === '\'') {
          menuName = menuName.substr(0, menuName.length - 1);
        }

        var menu = MENU_CACHE[menuName];

        if (!menu) return;

        e.preventDefault();

        menu.popup(remote.getCurrentWindow());
      }, false);
    }

    MenuService.prototype.registerContextMenu = function(menuName, menuItems) {
      var existingMenu = MENU_CACHE[menuName];

      if (existingMenu) return existingMenu;

      var menu = new Menu();

      for (let i = 0; i < menuItems.length; i++) {
        var menuItem = menuItems[i];

        if (!menuItem.label || !menuItem.click) {
          console.warn('MenuService - registerContextMenu - skipping menu item because it does not have either a label or a click function');
          continue;
        }

        menu.append(new MenuItem(menuItem));
      }

      MENU_CACHE[menuName] = menu;

      return menu;
    };

    return new MenuService();
  }
]);
