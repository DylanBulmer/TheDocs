var bcrypt = require('bcrypt');
var mysql = require('mysql');
var settings = require("../config.json");

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
            console.log("User is connecting");
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

    // Register User
    register(profile, callback) {
        let user;
        let db = this.db;
        console.log(profile);
        this.db.query("SELECT * FROM users", function (err, result) {
            if (err) throw err;
            if (settings.code != profile.code) {
                return callback({
                    "err": "Invailid Registration Code!"
                });
            } else {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].username == profile.username) {
                        return callback({
                            "err": "That username is already in use!"
                        });
                    } else if (result[i].email == profile.email) {
                        return callback({
                            "err": "That email is already in use!"
                        });
                    }
                }
                bcrypt.hash(profile.password, 10, function (err, hash) {
                    db.query("INSERT INTO users (name_first, name_last, username, email, password) VALUES ('" + profile.fname + "', '" + profile.lname + "', '" + profile.username + "', '" + profile.email + "', '" + hash + "' )")
                });
                return callback({
                    "result": profile,
                    "err": ""
                });
            }
        });
    }

    // Search method used with AJAX
    searchKeyword(key, callback) {
        this.db.query("SELECT * FROM keywords WHERE keyword LIKE '%" + key + "%'", function (err, rows, fields) {
            if (err) throw err;
            var data = [];
            for (let i = 0; i < rows.length; i++) {
                data.push(rows[i]);
            }
            callback(data);
        });
    }

    createProblem() {
        //do stuff
    }
}

// Document Table
// CREATE TABLE 'documents' ('id' INT(10) NOT NULL AUTO_INCREMENT,'user_id' INT(4) ZEROFILL NOT NULL,'title' VARCHAR(225) NOT NULL,'url' VARCHAR(255) NULL,'description' VARCHAR(255) NOT NULL, 'solution' BLOB NOT NULL, PRIMARY KEY ('id'), UNIQUE INDEX 'id_UNIQUE'('id' ASC));
