'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Settings
var data = require('./config.json');
var port = data.port;

//MySQL Setup
var database = require('./modules/database');
var db = new database(data.mysql);

// Make app use things
app.use(bodyParser.json());

app.get('/', function (req, res) {
    // Send nothing
    res.send();
});

app.post('/', function (req, res) {
    res.send({
        'host': data.host,
        'check': true
    });
});

app.post('/login', function (req, res) {
    let { username, password } = req.body;
    db.login(username, password, function (data) {
        res.json(data);
    });
});

app.listen(port, function () {
    console.log('TheDocs Server running on '+port+'!')
});

// Database Functions
db.connect();

// Classes

var User = class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
};