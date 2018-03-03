const path = require('path');
const fs = require('fs');

class Store {
    constructor() {
        this.path = '../config.json';   // Path to Config.JSON
        this.data = require(this.path);  // Data stored in JSON file
    }

    // PRE: key can be any value found in the config file
    // POST: returns value of key
    get(key) {
        return this.data[key];
    }

    // PRE: key and val can be any value
    // POST: returns value of set key
    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
        return this.get(val);
    }
}

module.exports = new Store;