'use strict';

const { app, dialog, Menu, BrowserWindow, ipcRenderer } = require('electron');
const locals = {};
const pug = require('electron-pug')({ pretty: true }, locals);
const autoUpdater = require("electron-updater").autoUpdater;

const path = require('path');
const url = require('url');
const Store = require('./modules/store');
const store = new Store({
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 800, height: 600 }
    }
});

const isDev = require('electron-is-dev');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var windows = [];
const views = __dirname + "/views/";

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
    };

    dialog.showMessageBox(dialogOpts, (response) => {
        if (response === 0) autoUpdater.quitAndInstall();
    });
});

// Report errors
autoUpdater.on('error', message => {
    console.error('There was a problem updating the application');
    console.error(message);
});

/**
 * 
 * @param {number} w Width
 * @param {number} h Height
 * @param {string} file The file's name to render
 */
function createWindow(w, h, file) {
    // Create the browser window.
    let { width, height } = store.get('windowBounds');

    let window = new BrowserWindow({
        title: "The Docs",
        minWidth: w || 800,
        minHeight: h || 500,
        width: w || width,
        height: h || height,
        show: file ? true : false,
        backgroundColor: '#1177ff',
        titleBarStyle: 'hiddenInset',
        frame: (process.platform === 'darwin') ? true : false
    });

    window.loadURL(url.format({
        pathname: path.join(views, file || 'index.pug'),
        protocol: 'file:',
        slashes: true
    }));

    window.once('ready-to-show', () => {
        window.show();
    });

    // Open the DevTools.
    if (isDev) {
        window.webContents.openDevTools();
    }
    
    window.on('resize', function () {
        let b = window.getBounds();
        store.set('windowBounds', { width: b.width, height: b.height });
    });

    // Emitted when the window is closed.
    window.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        windows.splice(windows.findIndex(element => { element === window; }), 1);
    });

    require('./js/mainmenu');

    windows.push(window);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    app.setAppUserModelId('com.github.dylanbulmer.thedocs');

    // Auto check for updates every 10 minutes
    setInterval(() => {
        autoUpdater.checkForUpdates();
    }, 10 * 60 * 1000);

    // Check now
    autoUpdater.checkForUpdates();

    // Create new window
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // Logout the user when all windows are closed.
    store.removeUser();

    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
