let form = document.getElementById('form');
let Store = require('../modules/store');
let store = new Store({ configName: 'user-preferences' });

form.style.marginTop = "calc(50vh - " + form.getBoundingClientRect()['height'] / 2 + "px)";

let msg = document.getElementById('msg');

var submition = function submition() {
    let host = document.getElementById('url').value;
    let port = document.getElementById('port').value;

    // do ajax stuff to check for server...
    if (host !== "") {

        // send request
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                result = JSON.parse(this.responseText);
                if ((result.host === host || result.url === host) && result.check === true) {
                    msg.innerHTML = "Connected!";
                    window.location.href = __dirname + "/login.html";
                } else {
                    msg.innerHTML = "Almost there...<br>Please verify the entered URL/IPv4";
                }
            } else {
                switch (this.readyState) {
                    case 0:
                        msg.innerHTML = " An error occured in the app";
                        break;
                    case 1:
                    case 2:
                        msg.innerHTML = 'Connecting <i class="fa fa-cog fa-spin fa-fw"></i>';
                        break;
                    case 3:
                        msg.innerHTML = 'Loading data <i class="fa fa-cog fa-spin fa-fw"></i>';
                        break;
                    case 4:
                        switch (this.status) {
                            case 0:
                                msg.innerHTML = 'The entered URL is invalid!';
                                break;
                            case 200:
                                msg.innerHTML = 'Connected!';
                                break;
                            case 403:
                                msg.innerHTML = 'That page is forbiden!';
                                break;
                            case 404:
                                msg.innerHTML = '404 - Page not found!';
                                break;
                        }
                        break;
                }
            }
        };
        if (host.substring(0, 7) !== "http://" || host.substring(0, 8) !== "https://") {
            store.set("host", host);
            if (!port) {
                store.set("url", "http://" + host);
                xhttp.open("POST", "http://" + host, true);
            } else {
                store.set("port", port);
                store.set("url", "http://" + host + ":" + port);
                xhttp.open("POST", "http://" + host + ":" + port, true);
            }
        } else {
            store.set("host", host);
            if (!port) {
                store.set("url", host);
                xhttp.open("POST", host, true);
            } else {
                store.set("url", host + ":1337");
                xhttp.open("POST", host + ":1337", true);
            }
        }
        xhttp.send();
    } else {
        msg.innerHTML = 'Please enter a Domian name or IPv4 address';
    }
    return false;
};

// Autologin if URL is set.
if (store.get('url')) {
    let host = document.getElementById('url');
    host.value = store.get("host");
}