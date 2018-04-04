'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const path = require('path');
const pug = require('pug');
const store = require('./modules/store');

// Require Web views and sources to get packaged
const admin = path.join(__dirname, '/views/admin.pug');
const css = path.join(__dirname, '/public/css/main.css');
const cssMD = path.join(__dirname, '/public/css/markdown.css');
const img = path.join(__dirname, '/public/image/TheDocsLogoNew_White.svg');

// Settings
const settings = require("./config.json");
const port = settings.port;

//MySQL Setup
const db = require('./modules/database.js');

// Make the server use things
const app = express();
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

// Verify a connection
app.post('/', function (req, res) {
    res.send({
        'url': settings.url,
        'host': settings.host,
        'check': true
    });
});

// Login to the docs
app.post('/login', function (req, res) {
    let { username, password } = req.body;
    db.login(username, password, function (data) {
        res.json(data);
    });
});

// Register a user
app.post('/register', function (req, res) {
    let profile = req.body;
    db.register(profile, function (data) {
        res.json(data);
    });
});

// Serach the docs
app.get('/search', function (req, res) {
    let keyword = req.query.key;
    db.searchKeyword(keyword, function (data) {
        res.json(data);
    });
});

// Create a new doc
app.post('/new', function (req, res) {
    let doc = req.body;

    // When all is good; go here
    let next = function () {
        let keys = doc.keywords;
        delete doc.keywords;

        console.log(doc, keys);
        db.createDocument(doc, keys, function callback(data) {
            res.json(data);
        });
    };

    // Check for project
    if (doc['project_id'].new) {
        db.db.query("SELECT * FROM projects", function (err, result) {
            let test = true;
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name === doc['project_id'].new) {
                        doc.project_id = result[i].id;
                        test = false;
                    }
                }
            }

            if (test) {
                db.createProject(doc['project_id'].new, function (err, result) {
                    if (err) {
                        return res.send({ err: err });
                    } else {
                        // Add id to project
                        doc['project_id'] = result.id;

                        next();
                    }
                });
            } else {
                next();
            }
        });
    } else {
        next();
    }
});

// Get projects
app.get('/projects', function (req, res) {
    db.getProjects(function (projects) {
        res.json(projects);
    });
});

// Get a doc by it's ID
app.post('/doc', function (req, res) {
    let post = req.body;
    db.getDoc(post.id, function (doc) {
        res.json(doc);
    });
});

// POST journal
app.post('/journal', (req, res) => {
    // The post request must be an array of arrays
    // Ex: [ [ user_id, project_id, description ], [ ... ] ]
    db.createJournal(req.body, (err, result) => {
        if (err) {
            console.log(err);
            res.send(false);
        } else {
            console.log(result);
            res.send(true);
        }
    });
});

// Get a log
// PRE: Send in account info to gain access
app.get('/log/:type/:id', (req, res) => {
    db.getLog(req.params.type, req.params.id, 0, function (events) {
        res.json(events);
    });
});

app.get('/log/:type/:id/:offset', function (req, res) {
    db.getLog(req.params.type, req.params.id, req.params.offset, function (events) {
        res.json(events);
    });
});
// END OF LOGS

app.get('/admin', (req, res) => {
    if (!settings.firstTime) {
        let users;
        let mysql = store.get("mysql");
        let org = store.get("organization");

        let p = db.getNumUsers().then(data => {
            users = data;
        });

        Promise.all([p]).then(() => {
            res.render(admin, {
                user: 'Test User',
                data: {
                    port: settings.port,
                    url: settings.url,
                    host: settings.host,
                    code: settings.code,
                    mysql: {
                        connection: db.isConnected,
                        users: db.isConnected ? users : 'N/A',
                        settings: {
                            host: db.isConnected ? mysql.host : 'N/A',
                            database: db.isConnected ? mysql.database : 'N/A',
                            user: db.isConnected ? mysql.user : 'N/A'
                        }
                    },
                    organization: {
                        name: org.name,
                        statement: org.statement
                    }
                }
            });
        });
    } else {
        res.redirect('/register');
    }
});

app.post('/admin', (req, res) => {
    let users;
    let mysql = store.get("mysql");

    let p = db.getNumUsers().then(data => {
        users = data;
    });

    Promise.all([p]).then(() => {
        res.render(admin, {
            user: 'Test User',
            data: {
                port: settings.port,
                mysql: {
                    connection: db.isConnected,
                    users: db.isConnected ? users : 'N/A',
                    settings: {
                        host: db.isConnected ? mysql.host : 'N/A',
                        database: db.isConnected ? mysql.database : 'N/A',
                        user: db.isConnected ? mysql.user : 'N/A'
                    }
                }
            }
        });
    });
});

app.listen(port, function () {
    console.log('TheDocs Server running on ' + port + '!');

    if (settings.firstTime === true) {
        console.log('');
        console.log('Please go to http://localhost:' + port + '/admin to setup the server!');
        console.log('');
    } else {
        // Connect to database after the app starts running
        db.connect();
    }
});