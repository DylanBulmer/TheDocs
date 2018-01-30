var bcrypt = require('bcrypt');
var mysql = require('mysql');
var settings = require("../config.json");

module.exports = class database {
    constructor() {
        this.data = settings.mysql;
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
                    // add table testing
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
                    db.query("INSERT INTO users (name_first, name_last, username, email, password) VALUES ('" + profile.fname + "', '" + profile.lname + "', '" + profile.username + "', '" + profile.email + "', '" + hash + "' )");
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
        // Fix this: change offset to the number of already loaded elements.
        let offset = 0;
        let self = this;
        this.db.query("SELECT * FROM keywords WHERE keyword LIKE '%" + key + "%' ORDER BY id DESC LIMIT 25 OFFSET " + offset, function (err, rows, fields) {
            if (err) throw err;
            // Add Doc title to each element
            let data = [];
            if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                    self.getDoc(rows[i].doc_id, function (doc) {
                        if (data.length == 0) {
                            rows[i]['title'] = doc.title;
                            data.push(rows[i]);
                        } else {
                            for (let d = 0; d < data.length; d++) {
                                if (data[d].doc_id == rows[i].doc_id) {
                                    if (data[d].keyword != rows[i].keyword) {
                                        data[d].keyword += ', ' + rows[i].keyword;
                                    }
                                } else if (d == (data.length - 1)) {
                                    rows[i]['title'] = doc.title;
                                    data.push(rows[i]);
                                }
                            }
                        }

                        if (i == (rows.length - 1)) {
                            callback(data);
                        }
                    });
                }
            } else {
                callback(data);
            }
        });
    }

    // Submit a new document to the database
    createDocument(doc, keywords, callback) {
        // PRE  doc      = { user_id: '', project_id: '', title: '', url: '', desc: '', solution: '' }
        //      keywords = [ ['keyword'], ['keyword'] ]; doc_id will be added automatically
        let docID = null;
        let db = this.db;

        db.query("INSERT INTO documents SET ?", doc, function (err, results, fields) {
            if (err) {
                return callback({
                    'err': err
                });
            } else {
                // Get id of inserted item
                docID = results.insertId;

                // Add doc_id to all keywords
                let keys = []
                for (let i = 0; i < keywords.length; i++) {
                    keys.push([keywords[i], docID]);
                }

                // Next store keywords
                db.query("INSERT INTO keywords (keyword, doc_id) VALUES ?", [keys], function (err, result) {
                    if (err) {
                        return callback({
                            'err': err
                        });
                    } else {
                        // return doc id if all goes well.
                        return callback({
                            'err': '',
                            'result': {
                                'id': docID
                            }
                        });
                    }
                });
            }
        });
    }

    // create a new project; use when user needs to add project
    createProject(name, callback) {
        this.db.query("insert into projects (name) values ('" + name + "' )", function (err, result) {
            if (err) {
                return callback({
                    'err': err
                });
            } else {
                return callback(false, { 'id': result.insertId });
            }
        });
    }

    // Get projects
    getProjects(callback) {
        // Fix this: change offset to the number of already loaded elements.
        this.db.query("SELECT * FROM projects", function (err, rows, fields) {
            if (err) throw err;
            callback(rows);
        });
    }

    // Get project by ID
    getProject(id, callback) {
        // Fix this: change offset to the number of already loaded elements.
        this.db.query("SELECT * FROM projects WHERE id=" + id, function (err, rows, fields) {
            if (err) throw err;
            callback(rows[0]);
        });
    }

    // Get doc by ID
    getDoc(id, callback) {
        let self = this
        // Get Doc
        this.db.query("SELECT * FROM documents WHERE id=" + id, function (err, rows, fields) {
            if (err) throw err;

            // Set doc
            let doc = rows[0];

            // Get project name
            self.getProject(doc.project_id, function (project) {
                doc['project'] = project.name;

                // Get the creator of the doc
                self.getUser(doc.user_id, function (user) {
                    doc['user'] = user;

                    // Get keywords associated with the doc
                    self.getKeywords(id, function (keywords) {
                        doc['keywords'] = keywords;

                        // Give back doc
                        callback(doc);
                    });
                });
            });
        });
    }

    getUser(id, callback) {
        this.db.query("SELECT * FROM users WHERE id=" + id, function (err, rows, fields) {
            if (err) throw err;
            let user = rows[0];

            // Remove sensitive data
            delete user.password;
            delete user.email;
            delete user.username;

            callback(user);
        });
    }

    getKeywords(id, callback) {
        this.db.query("SELECT * FROM keywords WHERE doc_id=" + id, function (err, rows, fields) {
            if (err) throw err;

            // create an array of keywords
            let keys = [];
            for (let i = 0; i < rows.length; i++) {
                keys.push(rows[i].keyword);
            }

            callback(keys);
        });
    }
}

// Document Table
// CREATE TABLE 'documents' ('id' INT(10) NOT NULL AUTO_INCREMENT,'user_id' INT(4) ZEROFILL NOT NULL,'title' VARCHAR(225) NOT NULL,'url' VARCHAR(255) NULL,'description' VARCHAR(255) NOT NULL, 'solution' BLOB NOT NULL, PRIMARY KEY ('id'), UNIQUE INDEX 'id_UNIQUE'('id' ASC));