'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');
const crashReporter = require('crash-reporter');
const ipcMain = require('electron').ipcMain;
const path = require('path');

require('src/mongotron').init();

const appConfig = require('src/config/appConfig');
const logger = require('lib/modules/logger');
const AutoUpdater = require('lib/modules/autoupdater');

/* ------------------------------------------------
 * App initialization
 * ------------------------------------------------ */
let mainWindow;
let autoUpdater = new AutoUpdater({
  repository: appConfig.repositoryName,
  repositoryOwner: appConfig.repositoryOwner,
  version: appConfig.version
});

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
  autoUpdater.checkForUpdates();

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
