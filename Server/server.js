'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Settings
var data = require('./config.json');
var port = data.port;

//MySQL Setup
var db = require('./modules/database');

// Make the server use things
app.use(bodyParser.json());

// Verify a connection
app.post('/', function (req, res) {
    res.send({
        'url': data.url,
        'host': data.host,
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
    }

    // Check for project
    if (doc['project_id'].new) {
        db.db.query("SELECT * FROM projects", function (err, result) {
            let test = true;
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].name == doc['project_id'].new) {
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

app.listen(port, function () {
    console.log('TheDocs Server running on ' + port + '!')

    // Connect to database after the app starts running
    db.connect();
});