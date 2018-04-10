'use strict';

var bcrypt = require('bcrypt');
var mysql = require('mysql');
var settings = require("../config.json");

class database {
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
                if (self.data.database === "") {
                    console.log("Please enter a database in the config.json file!");
                } else {
                    console.log();
                    console.log("MySQL Connection Established");
                    self.isConnected = true;
                    self.verifyDataBase();
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

    verifyDataBase() {
        // POST: Checks to see if everything is set up correctly
        console.log();
        console.log("Checking tables...");
        console.log();
        this.db.query("CREATE TABLE IF NOT EXISTS `users` (`id` int(4) NOT NULL AUTO_INCREMENT,`username` varchar(20) NOT NULL,`password` varchar(255) NOT NULL,`email` varchar(254) NOT NULL,`name_first` varchar(50) NOT NULL,`name_last` varchar(45) NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`),UNIQUE KEY `username_UNIQUE` (`username`),UNIQUE KEY `email_UNIQUE` (`email`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;", (err, result) => {
            if (err) {
                console.log(err.message);
                console.log("CREATE TABLE 'Users' ........ Failed");
            } else {
                console.log("TABLE 'Users' .......... Good");
            }
        });
        this.db.query("CREATE TABLE IF NOT EXISTS `projects` (`id` int(4) NOT NULL AUTO_INCREMENT,`name` varchar(50) NOT NULL DEFAULT 'Unnamed Project',PRIMARY KEY (`id`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;", (err, result) => {
            if (err) {
                console.log(err.message);
                console.log("CREATE TABLE 'Projects' ..... Failed");
            } else {
                console.log("TABLE 'Projects' ....... Good");
            }
        });
        this.db.query("CREATE TABLE IF NOT EXISTS `keywords` (`id` int(20) NOT NULL AUTO_INCREMENT,`keyword` varchar(50) NOT NULL,`doc_id` int(10) unsigned NOT NULL,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;", (err, result) => {
            if (err) {
                console.log(err.message);
                console.log("CREATE TABLE 'Keywords' ..... Failed");
            } else {
                console.log("TABLE 'Keywords' ....... Good");
            }
        });
        this.db.query("CREATE TABLE IF NOT EXISTS `documents` (`id` int(10) NOT NULL AUTO_INCREMENT,`user_id` int(4) NOT NULL,`project_id` int(4) NOT NULL,`title` varchar(60) NOT NULL,`url` varchar(255) DEFAULT NULL,`description` varchar(255) NOT NULL,`solution` blob NOT NULL,`created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY (`id`),UNIQUE KEY `id_UNIQUE` (`id`)) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;", (err, result) => {
            if (err) {
                console.log(err.message);
                console.log("CREATE TABLE 'Documents' .... Failed");
            } else {
                console.log("TABLE 'Documents' ...... Good");
            }
        });
    }

    // Login User
    login(username, password, callback) {
        let user;
        this.db.query("SELECT * FROM users", function (err, result) {
            if (err) throw err;
            console.log("User is connecting");
            for (let i = 0; i < result.length; i++) {
                if (result[i].username === username || result[i].email === username) {
                    // Tests to see if passwords match
                    bcrypt.compare(password, result[i].password, function (err, pass) {
                        if (pass) {
                            user = result[i];
                            if (user !== null) {
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
                } else if (i === result.length - 1) {
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
            if (settings.code !== profile.code) {
                return callback({
                    "err": "Invailid Registration Code!"
                });
            } else {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].username === profile.username) {
                        return callback({
                            "err": "That username is already in use!"
                        });
                    } else if (result[i].email === profile.email) {
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
                        if (data.length === 0) {
                            rows[i]['title'] = doc.title;
                            data.push(rows[i]);
                        } else {
                            for (let d = 0; d < data.length; d++) {
                                if (data[d].doc_id === rows[i].doc_id) {
                                    if (data[d].keyword !== rows[i].keyword) {
                                        data[d].keyword += ', ' + rows[i].keyword;
                                    }
                                } else if (d === data.length - 1) {
                                    rows[i]['title'] = doc.title;
                                    data.push(rows[i]);
                                }
                            }
                        }

                        if (i === rows.length - 1) {
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
                let keys = [];
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

    // create a new journal
    createJournal(journals, callback) {
        this.db.query("insert into journals (user_id, project_id, description) values ? ", [journals], function (err, result) {
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
        let self = this;
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

    async getNumUsers() {
        return new Promise(resolve => {
            if (this.isConnected) {
                this.db.query("SELECT id FROM users", function (err, rows, fields) {
                    resolve(rows.length);
                });
            } else {
                resolve(0);
            }
        });
    }

    /**
     * @returns {Function} callback will be returned 
     * @param {String} type Type of log to grab
     * @param {Number} id ID should be a number
     * @param {Number} offset Increment by one to get 25 more logs
     * @param {Function} callback Callback the log with a function
     */
    getLog(type, id, offset, callback) {
        let docs, journals, d, p;
        switch (type) {
            case "user":
                // Grab Documents for user
                this.db.query("SELECT * FROM ( (SELECT id, user_id, project_id, title, created FROM documents) UNION ALL (SELECT id, user_id, project_id, NULL AS title, created FROM journals)) results WHERE user_id = " + id + " ORDER BY created DESC LIMIT 20 OFFSET " + (20 * offset), (err, rows, fields) => {
                    return callback(rows);
                });

                break;
            case "project":
                // Grab documents and journals for project by id
                this.db.query("SELECT * FROM ( (SELECT id, user_id, project_id, title, created FROM documents) UNION ALL (SELECT id, user_id, project_id, NULL AS title, created FROM journals)) results WHERE project_id = " + id + " ORDER BY created DESC LIMIT 20 OFFSET " + (20 * offset), (err, rows, fields) => {
                    return callback(rows);
                });
                break;
            default:
                return callback("Event Logs");
        }
    }
}

module.exports = new database();