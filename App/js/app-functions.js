let { BrowserWindow } = require('electron').remote;
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({ configName: 'user-preferences' });
}

// Focused window
var thisWindow;

// Buttons
let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');

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
    nav.setAttribute('style', 'right: -250px;');
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
}