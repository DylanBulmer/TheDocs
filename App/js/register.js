let form = document.getElementById('form');
if (typeof(Store) === 'undefined') {
    var Store = require('../modules/store');
    var store = new Store({
        configName: 'user-preferences'
    });
}

form.style.marginTop = "calc(50vh - " + form.getBoundingClientRect()['height'] / 2 + "px)";

let msg = document.getElementById('msg');

var submition = function () {
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let cpassword = document.getElementById('confirm_password').value;
    let fname = document.getElementById('fname').value;
    let lname = document.getElementById('lname').value;
    let code = document.getElementById('code').value;

    // do ajax stuff to check for server...
    if (password === cpassword) {
        // create request
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                result = JSON.parse(this.responseText);
                if (result.err) {
                    msg.innerHTML = result.err;
                } else {
                    msg.innerHTML = "Logged In!";
                    store.setUser(result.result);
                    window.location.href = __dirname + "/app.pug";
                }
            } else {
                switch (this.readyState) {
                    case 0:
                        msg.innerHTML = " An error occured in the app";
                        break;
                    case 1:
                    case 2:
                        msg.innerHTML = 'Registering <i class="fa fa-cog fa-spin fa-fw"></i>';
                        break;
                    case 3:
                        msg.innerHTML = 'Loading data <i class="fa fa-cog fa-spin fa-fw"></i>';
                        break;
                    case 4:
                        switch (this.status) {
                            case 0:
                                msg.innerHTML = 'An error has occured!';
                                break;
                            case 200:
                                msg.innerHTML = 'Done!';
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
        xhttp.open("POST", store.get('url') + "/register", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(
            {
                username: username,
                email: email,
                name_first: fname,
                name_last: lname,
                password: password,
                code: code
            }
        ));
    } else {
        msg.innerHTML = 'Please enter your username and password!';
    }
    return false;
};
