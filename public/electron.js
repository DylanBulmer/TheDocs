const {app, Tray, Menu, BrowserWindow} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "The Docs",
    darkTheme: true,
    minWidth: 800,
    minHeight: 500,
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    },
    show: false,
    icon: path.join(__dirname, 'image/icon/iconWhite@4x.png'),
    frame: true
  });

  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

  // Open the DevTools.
  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });
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
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});