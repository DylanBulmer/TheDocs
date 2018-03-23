/**
 * All handlers will be in this file!
 */

// Logout handler
var logout = function logout() {
    store.removeUser();
    window.location.href = "login.html";
};

// Open Nav
var openNav = () => {
    let nav = document.getElementsByTagName('nav')[0];
    nav.setAttribute('style', 'right: 0;');
};

// Close Nav
var closeNav = () => {
    let nav = document.getElementsByTagName('nav')[0];
    nav.setAttribute('style', 'right: -250px;');
};

// The "Go To" Create Functions
var create = {
    // Go to the Create a new document page
    'doc': () => {

    },
    // Go to the Create a new project page
    'project': () => {

    }
};