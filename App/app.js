'use strict';
const { app, dialog, BrowserWindow } = require('electron');
const autoUpdater = require("electron-updater").autoUpdater;

const path = require('path');
const url = require('url');
const Store = require('./modules/store');

const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let views = __dirname + "/views/";

// Change the path if in development
if (isDev) {
    autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
}

// Ask user to quit and restart after update has been downloaded
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail: 'An update has been downloaded! Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts, (response) => {
        if (response === 0) autoUpdater.quitAndInstall();
    });
});

// Report errors
autoUpdater.on('error', message => {
    console.error('There was a problem updating the application')
    console.error(message)
});

function createWindow() {
    const store = new Store({
        configName: 'user-preferences',
        defaults: {
            windowBounds: { width: 800, height: 600 }
        }
    });
    // Create the browser window.
    let { width, height } = store.get('windowBounds');
    mainWindow = new BrowserWindow({ width, height });

    mainWindow.loadURL(url.format({
        pathname: path.join(views, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    mainWindow.on('resize', function () {
        let b = mainWindow.getBounds();
        store.set('windowBounds', { width: b.width, height: b.height });
    })

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    app.setAppUserModelId('com.github.dylanbulmer.thedocs');

    // Create new window
    createWindow();

    // Auto check for updates every 5 minutes
    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, (5 * 60 * 1000))

    // Check now
    autoUpdater.checkForUpdates();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.