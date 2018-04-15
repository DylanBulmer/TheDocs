const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData'); // Appdata path
        this.path = path.join(userDataPath, opts.configName + '.json');                 // Path to JSON
        this.data = this.parseDataFile(this.path, opts.defaults);                       // Data stored in JSON file
    }
  
    // Get data
    /**
     * @description Grab any value by its name.
     * @param {String} key The name of the value you want to grab
     * @returns {any} Returns the value requested
     */
    get(key) {
        return this.data[key];
    }
  
    // Set data
    /**
     * @param {String} key The name to store for the give value.
     * @param {any} val The value to store.
     */
    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    /**
     * @param {FormData} data The data to store for the user.
     */
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

    getUser() {
        let sending = {};
        sending.user = this.data['user'];
        sending.logged_in = this.data['logged_in'];
        return sending;
    }
    /**
     * @param {String} filePath The path to the file.
     * @param {JSON} defaults Custom set default settings.
     * @returns {JSON} Returns the default settings for the app. 
     */
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