const { BrowserWindow } = require('electron').remote;
// Retrieve focused window
var thisWindow;

let min = document.getElementById('min');
let max = document.getElementById('max');
let close = document.getElementById('close');

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

var checkWindow = function () {
    if (!thisWindow) {
        thisWindow = BrowserWindow.getFocusedWindow();
    }
};