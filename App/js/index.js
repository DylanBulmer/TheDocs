let form = document.getElementById('form');
if (typeof Store === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({
        configName: 'user-preferences'
    });
}

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
                    window.location.href = __dirname + "/login.pug";
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
        let auto = document.getElementById("auto");
        store.set("autoConnect", auto.checked);
        if (host.substring(0, 7) !== "http://" || host.substring(0, 8) !== "https://") {
            let domain = host.substring(0, 7) === "http://" ? host.substring(7) : host;
            console.log(domain, port);
            store.set("host", domain);
            if (!port) {
                store.set("url", "http://" + domain);
                store.set("port", 80);
                xhttp.open("POST", "http://" + domain, true);
            } else {
                store.set("port", port);
                store.set("url", "http://" + domain + ":" + port);
                xhttp.open("POST", "http://" + domain + ":" + port, true);
            }
        } else {
            store.set("host", host);
            store.set("url", host);
            store.set("port", null);
            xhttp.open("POST", host, true);
        }
        xhttp.send();
    } else {
        msg.innerHTML = 'Please enter a Domian name or IPv4 address';
    }
    return false;
};

/**
 * @description Input saved values to the form.
 * @param {Boolean} go If true; go straight to signin page.
 */
var setup = (go) => {
    // Grab variables from the store.
    let url = store.get("host");
    let port = store.get("port");
    let auto = store.get("autoLogin");

    // Throw saved host into form
    if (url) {
        let host = document.getElementById('url');
        host.value = url;
    }
    // Throw saved port into form
    if (port && port === 80) {
        let portInput = document.getElementById('port');
        portInput.value = "";
    } else if (port) {
        let portInput = document.getElementById('port');
        portInput.value = port;
    }
    // Throw saved auto login checkbox value into form
    if (auto) {
        let autoInput = document.getElementById('auto');
        autoInput.checked = auto;
    }

    // Start the server call?
    if (auto) {
        submition();
    }
}

setup(false);
