const {app, Tray, Menu, BrowserWindow} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
const isMac = process.platform === 'darwin';

/**
 * @namespace windows
 * @type {BrowserWindow[]}
 */
let windows = [];

/**
 * @namespace tray
 * @type {Tray}
 */
let tray = null;

function createWindow () {
  // Create the browser window.
  let newWindow = new BrowserWindow({
    title: "The Docs",
    darkTheme: true,
    vibrancy: "dark",
    minWidth: 1000,
    minHeight: 600,
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    show: false,
    icon: path.join(__dirname, 'image/icon/icon@4x.png')
  });

  newWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (isDev) newWindow.webContents.openDevTools();

  newWindow.once('ready-to-show', () => {
    newWindow.show();
  });

  // Emitted when the window is closed.
  newWindow.on('closed', function () {
    windows.splice(windows.findIndex(element => { element === newWindow; }), 1);
  });

  windows.push(newWindow);
}

app.on('ready', () => {
  app.setAppUserModelId('com.github.dylanbulmer.thedocs');

  tray = new Tray(path.join(__dirname, 'image/icon/icon@4x.png'));
  const contextMenu = Menu.buildFromTemplate([
      {
          label: 'The Docs 2.0',
          type: 'normal',
          enabled: false
      },
      {
          label: 'New window',
          type: 'normal',
          click() {
              createWindow();
          }
      },
      {
          label: 'Exit',
          type: 'normal',
          click() {
              app.exit();
          }
      }
  ]);
  tray.setToolTip('The Docs');
  tray.on('click', () => {
      if (windows.length > 0) windows[0].show();
      else createWindow();
  });
  tray.setContextMenu(contextMenu);

  createWindow()
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (isMac) app.quit();
});

app.on('activate', function () {
  if (windows.length === 0) createWindow();
});