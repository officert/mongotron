/* ------------------------------------------------
 * Dependencies
 * ------------------------------------------------ */
const app = require('app');
const BrowserWindow = require('browser-window');
const crashReporter = require('crash-reporter');
const ipc = require('ipc');

const appConfig = require('src/config/appConfig');

/* ------------------------------------------------
 * App initialization
 * ------------------------------------------------ */
var mainWindow;

crashReporter.start(); // Report crashes to our server.

ipc.on('set-title', function(event, title) {
  mainWindow.setTitle(title || 'Mongotron');
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
    width: 1200,
    height: 800
  });

  mainWindow.loadUrl('file://' + __dirname + '/browser/index.html');

  if (appConfig.ENV !== 'production') mainWindow.openDevTools();

  mainWindow.webContents.on('did-finish-load', function() {
    mainWindow.setTitle('Mongotron');
  });

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
