let { BrowserWindow } = require('electron').remote;
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({ configName: 'user-preferences' });
}

// Focused window
/**
 * @namespace thisWindow
 * @type {Electron.BrowserWindow}
 */
var thisWindow;

// Buttons
let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');
let undo = document.getElementById('undo');
let redo = document.getElementById('redo');
let cut = document.getElementById('cut');
let copy = document.getElementById('copy');
let paste = document.getElementById('paste');
let selectAll = document.getElementById('selectAll');
let reload = document.getElementById('reload');
let zookIn = document.getElementById('zoomIn');
let zoomOut = document.getElementById('zoomOut');
let zoomReset = document.getElementById('zoomReset');
let fullscreen = document.getElementById('toggleFullscreen');

// other elements
let titlebar = document.getElementsByClassName('titlebar')[0];
let nav = document.getElementsByTagName('nav')[0];
let navCover = document.getElementsByTagName('navCover')[0];

/**
 * All handlers will be in this file!
 */

// Logout handler
var logout = function logout() {
    store.removeUser();
    window.location.href = "login.pug";
};

// Open Nav
var openNav = () => {
    let top = titlebar.getBoundingClientRect().height;
    navCover.setAttribute("style", "display: block; height: calc(100vh - " + top + "px); top: " + top + "px;");
    nav.setAttribute('style', 'right: 0;');
};

// Close Nav
var closeNav = () => {
    let top = titlebar.getBoundingClientRect().height;
    navCover.setAttribute("style", "display: none; height: calc(100vh - " + top + "px); top: " + top + "px;");
    nav.setAttribute('style', 'right: -250px; visibility: hidden;');
};

// The "Go To" Create Functions
var create = {
    // Go to the Create a new document page
    'doc': () => {
        if (view) {
            view('newDoc');
        }
    },
    // Go to the Create a new project page
    'project': () => {
        if (view) {
            view('newProject');
        }
    },
    // Go to the journal page
    'journal': () => {
        if (view) {
            view('newJournal');
        }
    }
};

if (!/(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(navigator.userAgent)) {
    min.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.minimize();
    });

    max.addEventListener('click', (e) => {
        checkWindow();
        if (thisWindow.isMaximized()) {
            thisWindow.restore();
            isMaximized = false;
        } else {
            thisWindow.maximize();
            isMaximized = true;
        }
    });

    close.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.close();
    });

    undo.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.undo();
    });

    redo.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.redo();
    });

    cut.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.cut();
    });

    copy.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.copy();
    });

    paste.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.paste();
    });

    selectAll.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.selectAll();
    });
    
    reload.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.reload();
    });

    zoomIn.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.getZoomLevel((level) => {
            if (level < 300) {
                thisWindow.webContents.setZoomLevel(level + 1);
            }
        });
    });

    zoomOut.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.getZoomLevel((level) => {
            if (level > -3) {
                thisWindow.webContents.setZoomLevel(level - 1);
            }
        });
    });
    
    zoomReset.addEventListener('click', (e) => {
        checkWindow();
        thisWindow.webContents.setZoomLevel(0);
    });

    fullscreen.addEventListener('click', (e) => {
        checkWindow();
        if (thisWindow.isFullScreen()) {
            thisWindow.setFullScreen(false);
        } else {
            thisWindow.setFullScreen(true);
        }
    });
}

var checkWindow = function () {
    if (!thisWindow) {
        thisWindow = BrowserWindow.getFocusedWindow();
    }
};

if (navCover) {
    navCover.addEventListener('click', closeNav);
}

var escapeHTML = function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

var sendMessage = (type, id, msg) => {
    let col = document.getElementById(id);

    let info = document.createElement('infobox');
    let block = document.createElement(type + 'block');
    let span = document.createElement('span');

    span.innerText = msg;

    info.appendChild(block);
    info.appendChild(span);

    col.appendChild(info);

    setTimeout(() => {
        info.setAttribute('style', 'opacity: 1');
    }, 50);

    setTimeout(() => {
        info.setAttribute('style', 'opacity: 0');

        setTimeout(() => {
            col.removeChild(info);
        }, 350);
    }, 7500);
};