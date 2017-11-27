'use strict';
var express = require('express');
var app = express();
var mysql = require('mysql');

// Settings
var data = require('./config.json');
var port = data.port;

app.get('/', function (req, res) {
    // Send nothing
    res.send();
});

app.post('/', function (req, res) {
    res.send({
        'host': data.url,
        'check': true
    });
});

app.listen(port, function () {
    console.log('TheDocs Server running on '+port+'!')
});

// Database Functions

var DBisConnected = false;
var db;

function handleDisconnect() {
    db = mysql.createConnection(data.mysql);

    db.connect(function (err) {
        if (err) {
            DBisConnected = false;
            console.log("MySQL ERROR: " + err.code);
            setTimeout(handleDisconnect, 2000);
        } else {
            if (data.mysql.database == "") {
                console.log("Please enter a database in the config.json file!");
            } else {
                console.log("MySQL Connection Established");
                DBisConnected = true;
            }
        }

        db.on('error', function (err) {
            console.log('MySQL Error: ', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                DBisConnected = false;
                handleDisconnect();
            } else {
                throw err;
            }
        });
    });
}

handleDisconnect();