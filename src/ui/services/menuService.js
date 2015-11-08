'use strict';
var ipc = require('ipc');
var shell = require('shell');
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');
var appConfig = require('src/config/appConfig');

angular.module('app').factory('menuService', [
  '$window',
  '$rootScope',
  '$timeout',
  'dialogService',
  function($window, $rootScope, $timeout, dialogService) {
    let MENU_CACHE = {};

    function MenuService() {
      initMainMenu();
      initContextMenus();
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

    /* ------------------------
     * Private Helpers
     * ------------------------ */
    function initContextMenus() {
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

    function initMainMenu() {
      var name = appConfig.name;

      var template = [{
        label: name,
        submenu: [{
          label: 'About ' + name,
          role: 'about'
        }, {
          type: 'separator'
        }, {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: function() {
            $timeout(function() {
              $rootScope.showSettings();
            });
          }
        }, {
          type: 'separator'
        }, {
          label: 'Services',
          role: 'services',
          submenu: []
        }, {
          type: 'separator'
        }, {
          label: 'Hide ' + name,
          accelerator: 'Command+H',
          role: 'hide'
        }, {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          role: 'hideothers'
        }, {
          label: 'Show All',
          role: 'unhide'
        }, {
          type: 'separator'
        }, {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            ipc.send('quit');
          }
        }, ]
      }, {
        label: 'File',
        submenu: [{
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: function() {
            $timeout(function() {
              dialogService.showSaveDialog()
                .then(function(fileNames) {
                  console.log(fileNames);
                });
            });
          }
        }]
      }, {
        label: 'Go',
        submenu: [{
          label: 'Connection Manager',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: function() {
            $timeout(function() {
              $rootScope.showConnections('LIST');
            });
          }
        }, ]
      }, {
        label: 'New',
        submenu: [{
          label: 'Connection',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: function() {
            $timeout(function() {
              $rootScope.showConnections('ADD');
            });
          }
        }, ]
      }, {
        label: 'View',
        submenu: [{
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.reload();
          }
        }, {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Ctrl+Command+F';
            else
              return 'F11';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
          }
        }, {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin')
              return 'Alt+Command+I';
            else
              return 'Ctrl+Shift+I';
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        }, ]
      }, {
        label: 'Window',
        role: 'window',
        submenu: [{
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        }, ]
      }, {
        label: 'Help',
        role: 'help',
        submenu: [{
          label: 'Learn More',
          click: function() {
            shell.openExternal(appConfig.repository);
          }
        }]
      }];

      if (process.platform === 'darwin') {
        // Window menu.
        template[3].submenu.push({
          type: 'separator'
        }, {
          label: 'Bring All to Front',
          role: 'front'
        });
      }

      var menu = Menu.buildFromTemplate(template);

      Menu.setApplicationMenu(menu);
    }

    return new MenuService();
  }
]);

angular.module('app').run([
  'menuService',
  function(menuService) { // jshint ignore:line

  }
]);
