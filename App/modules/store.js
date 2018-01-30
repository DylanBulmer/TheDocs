const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData'); // Appdata path
        this.path = path.join(userDataPath, opts.configName + '.json'); // Path to JSON
        this.data = this.parseDataFile(this.path, opts.defaults);       // Data stored in JSON file
    }
  
    // Get data
    get(key) {
        return this.data[key];
    }
  
    // Set data
    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    setUser(data) {
        console.log(data);
        this.data['logged_in'] = true;
        this.data['user'] = {
            username: data.username,
            name: {
                first: data.name_first,
                last: data.name_last
            },
            id: data.id
        };
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    removeUser() {
        this.data['logged_in'] = false;
        this.data['user'] = {};
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
    
    parseDataFile(filePath, defaults) {
        try {
            return JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            fs.writeFileSync(filePath, JSON.stringify(defaults));
            return defaults;
        }
    }
}

module.exports = Store;