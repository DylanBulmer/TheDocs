// This script is just to take data from the Store and apply it to the app interface.

var store = new Store({ configName: 'user-preferences' });
var user = store.get("user");

let fnames = document.getElementsByClassName('fname');
for (i = 0; i < fnames.length; i++) {
    //console.log(store.getUser());
    fnames[i].innerText = user.name.first
}
let lnames = document.getElementsByClassName('lname');
for (i = 0; i < lnames.length; i++) {
    lnames[i].innerText = user.name.last
}