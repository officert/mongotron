'use strict';

angular.module('app').factory('menuService', [
  '$window',
  '$rootScope',
  '$timeout',
  'dialogService',
  'tabCache',
  'navUtils', ($window, $rootScope, $timeout, dialogService, tabCache, navUtils) => {
    const ipcRenderer = require('electron').ipcRenderer;
    const shell = require('shell');
    const remote = require('remote');
    const Menu = remote.require('menu');
    const MenuItem = remote.require('menu-item');
    const appConfig = require('src/config/appConfig');
    const logger = require('lib/modules/logger');

    function MenuService() {
      initMainMenu();
    }

    MenuService.prototype.showMenu = menuItems => {
      let menu = new Menu();

      for (let i = 0; i < menuItems.length; i++) {
        let menuItem = menuItems[i];

        if (!menuItem.label || !menuItem.click) {
          logger.warn('MenuService - registerContextMenu - skipping menu item because it does not have either a label or a click function');
          continue;
        }

        menu.append(new MenuItem(menuItem));
      }

      menu.popup(remote.getCurrentWindow());
    };

    let mongotronMenu = {
      label: appConfig.name,
      submenu: [{
        label: 'About ' + appConfig.name,
        click: () => {
          $timeout(() => {
            navUtils.showAbout();
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Preferences...',
        accelerator: 'CmdOrCtrl+,',
        click: () => {
          $timeout(() => {
            navUtils.showSettings();
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
        label: 'Hide ' + appConfig.name,
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
        click: () => {
          ipcRenderer.send('quit');
        }
      }, ]
    };

    let fileMenu = {
      label: 'File',
      submenu: [{
        label: 'Connect',
        accelerator: 'CmdOrCtrl+O',
        click: () => {
          $timeout(() => {
            navUtils.showConnections();
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          $timeout(() => {
            dialogService.showSaveDialog()
              .then(fileNames => {
                logger.debug(fileNames);
              });
          });
        }
      }, {
        type: 'separator'
      }, {
        label: 'Close Tab',
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          $timeout(() => {
            tabCache.removeActive();
          });
        }
      }, {
        label: 'Close All Tabs',
        click: () => {
          $timeout(() => {
            tabCache.removeAll();
          });
        }
      }]
    };

    let editMenu = {
      label: 'Edit',
      submenu: [{
        label: 'Cut',
        accelerator: 'Cmd+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'Cmd+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'Cmd+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'Cmd+A',
        selector: 'selectAll:'
      }]
    };

    let viewMenu = {
      label: 'View',
      submenu: [{
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: (item, focusedWindow) => {
          if (focusedWindow)
            focusedWindow.reload();
        }
      }, {
        label: 'Logs',
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          $timeout(() => {
            navUtils.showLogs();
          });
        }
      }, {
        label: 'Toggle Full Screen',
        accelerator: (() => {
          if (process.platform === 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }, {
        label: 'Toggle Developer Tools',
        accelerator: (() => {
          if (process.platform === 'darwin')
            return 'Alt+Command+I';
          else
            return 'Ctrl+Shift+I';
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow)
            focusedWindow.toggleDevTools();
        }
      }, ]
    };

    let helpMenu = {
      label: 'Help',
      role: 'help',
      submenu: [{
        label: 'Learn More',
        click: () => {
          shell.openExternal(appConfig.website);
        }
      }]
    };

    function initMainMenu() {
      let template = [
        mongotronMenu,
        fileMenu,
        editMenu,
        viewMenu,
        helpMenu
      ];

      let menu = Menu.buildFromTemplate(template);

      Menu.setApplicationMenu(menu);
    }

    return new MenuService();
  }
]);

angular.module('app').run([
  'menuService', () => {}
]);
