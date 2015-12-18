/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const app = require('app');
const BrowserWindow = require('browser-window');
const crashReporter = require('crash-reporter');
const ipcMain = require('electron').ipcMain;
const path = require('path');

require('src/mongotron').init();

const appConfig = require('src/config/appConfig');
const logger = require('lib/modules/logger');

logger.debug('appConfig');
logger.debug(appConfig);

/* ------------------------------------------------
 * App initialization
 * ------------------------------------------------ */
var mainWindow;

crashReporter.start(); // Report crashes to our server.

ipcMain.on('set-title', function(event, title) {
  mainWindow.setTitle(title || appConfig.name);
});

ipcMain.on('quit', function() {
  app.quit();
});

app.on('window-all-closed', function() {
  // Quit when all windows are closed.
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    center: true
  });

  mainWindow.maximize();

  mainWindow.setMinimumSize(770, 400);

  mainWindow.loadUrl(path.join('file://', __dirname, '../ui/index.html'));

  // if (appConfig.env !== 'production') mainWindow.openDevTools();

  mainWindow.on('close', function() {
    app.quit();
  });

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

process.on('uncaughtException', function() {
  console.log('\n\nUNCAUGHT ERROR\n');
  console.log("caught from process");
});
