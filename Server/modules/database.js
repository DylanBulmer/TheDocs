var bcrypt = require('bcrypt');
var mysql = require('mysql');

module.exports = class database {
    constructor(data) {
        this.data = data;
        this.isConnected = false;
        this.db;
    }

    // Connect to database
    connect() {
        let self = this;
        this.db = mysql.createConnection(this.data);

        this.db.connect(function (err) {
            if (err) {
                self.isConnected = false;
                console.log("MySQL ERROR: " + err.code);
                setTimeout(self.connect, 2000);
            } else {
                if (self.data.database == "") {
                    console.log("Please enter a database in the config.json file!");
                } else {
                    console.log("MySQL Connection Established");
                    self.isConnected = true;
                }
            }

            self.db.on('error', function (err) {
                console.log('MySQL Error: ', err);
                if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                    self.isConnected = false;
                    self.connect();
                } else {
                    throw err;
                }
            });
        });
    }

    // Login User
    login(username, password, callback) {
        let user;
        this.db.query("SELECT * FROM users", function (err, result) {
            if (err) throw err;
            for (let i = 0; i < result.length; i++) {
                if (result[i].username == username || result[i].email == username) {
                    // Tests to see if passwords match
                    bcrypt.compare(password, result[i].password, function (err, pass) {
                        if (pass) {
                            user = result[i];
                            if (user != null) {
                                // Logging
                                let date = new Date();
                                console.log("User: " + result[i].username + " logged in at " + date);
                                // Send user back
                                return callback({
                                    "result": result[i],
                                    "err": ""
                                });
                            }
                        } else {
                            return callback({
                                "err": "Invalid password"
                            });
                        }
                    });
                } else if (i == result.length - 1) {
                    return callback({
                        "err": "Invaild Username/Email"
                    });
                }
            }
        });
    }

    // Search metheod - use socket.io for live search?
}