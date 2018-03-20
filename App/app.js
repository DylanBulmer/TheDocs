'use strict';

const { app, dialog, Menu, BrowserWindow, ipcRenderer } = require('electron');
const locals = {};
const pug = require('electron-pug')({ pretty: true }, locals);
const autoUpdater = require("electron-updater").autoUpdater;

const path = require('path');
const url = require('url');
const Store = require('./modules/store')
const store = new Store({
    configName: 'user-preferences',
    defaults: {
        windowBounds: { width: 800, height: 600 }
    }
});

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

// New Menu for application

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Document',
                click() {
                    let focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.webContents.executeJavaScript("if (viewPage) { viewPage('c_new'); }");
                }
            },
            { type: 'separator' },
            {
                label: 'Logout',
                click() {
                    let focusedWindow = BrowserWindow.getFocusedWindow();
                    focusedWindow.webContents.executeJavaScript("if (logout) { logout() }");
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [
            {
                label: 'Learn More',
                click() { require('electron').shell.openExternal('https://dylanbulmer.github.io/TheDocs'); }
            }
        ]
    }
];

/* MacOS Menu */

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services', submenu: [] },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
        ]
    });

    // Edit menu
    template[1].submenu.push(
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' }
            ]
        }
    );

    // Window menu
    template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
    ];
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

function createWindow() {
    // Create the browser window.
    let { width, height } = store.get('windowBounds');
    mainWindow = new BrowserWindow({
        title: "The Docs",
        width: width,
        height: height,
        show: false,
        backgroundColor: '#1177ff',
        titleBarStyle: 'hiddenInset',
        frame: false
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(views, 'index.pug'),
        protocol: 'file:',
        slashes: true
    }));
    
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on('resize', function () {
        let b = mainWindow.getBounds();
        store.set('windowBounds', { width: b.width, height: b.height });
    });

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
    if (mainWindow === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.