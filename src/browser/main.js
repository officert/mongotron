'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const crashReporter = require('crash-reporter');
const ipcMain = require('electron').ipcMain;
const path = require('path');
const GhReleases = require('electron-gh-releases');

require('src/mongotron').init();

const appConfig = require('src/config/appConfig');
const logger = require('lib/modules/logger');

let autoUpdateOptions = {
  repo: 'officert/mongotron',
  currentVersion: app.getVersion()
};

console.log('autoUpdateOptions', autoUpdateOptions);

const updater = new GhReleases(autoUpdateOptions);

updater.check((err, status) => {
  console.log('updater check', err, status);

  if (!err && status) {
    updater.download(); // Download the update
  }
});

// When an update has been downloaded
updater.on('update-downloaded', (info) => {
  console.log('updater downloaded', info);

  updater.install(); // Restart the app and install the update
});

/* ------------------------------------------------
 * App initialization
 * ------------------------------------------------ */
let mainWindow;

crashReporter.start(); // Report crashes to our server.

ipcMain.on('set-title', (event, title) => {
  mainWindow.setTitle(title || appConfig.name);
});

ipcMain.on('quit', () => {
  app.quit();
});

app.on('window-all-closed', () => {
  // Quit when all windows are closed.
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    center: true
  });

  mainWindow.maximize();

  mainWindow.setMinimumSize(770, 400);

  mainWindow.loadUrl(path.join(`file://${__dirname}`, '../ui/index.html'));

  // if (appConfig.env !== 'production') mainWindow.openDevTools();

  mainWindow.on('close', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

process.on('uncaughtException', () => {
  logger.error('\n\nUNCAUGHT ERROR\n');
  logger.error('caught from process');
});
