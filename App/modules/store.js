const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData'); // Appdata path
        this.path = path.join(userDataPath, opts.configName + '.json');                 // Path to JSONs
        this.data = this.parseDataFile(this.path, opts.defaults);                       // Data stored in JSON file
    }
  
    // Get data
    /**
     * @description Grab any value by its name.
     * @param {String} key The name of the value you want to grab
     * @returns {any} Returns the value requested
     */
    get(key) {
        // reload data before grabbing key...
        // other instances may have saved data that another may not have internally
        // this happens often...
        this.reload();
        // grab key and send it back.
        return this.data[key];
    }
  
    // Set data
    /**
     * @param {String} key The name to store for the give value.
     * @param {any} val The value to store.
     */
    set(key, val) {
        // reload data before setting key...
        this.reload();
        // Now set the key.
        this.data[key] = val;
        this.saveFile();
    }

    /**
     * @param {FormData} data The data to store for the user.
     */
    setUser(data) {
        this.reload();
        this.data['logged_in'] = true;
        this.data['user'] = {
            username: data.username,
            name: {
                first: data.name_first,
                last: data.name_last
            },
            id: data.id
        };
        this.saveFile();
    }

    removeUser() {
        // reload data before setting key...
        this.reload();
        // now remove....
        this.data['logged_in'] = false;
        this.data['user'] = {};
        this.data['autoLogin'] = false;
        this.saveFile();
    }

    getUser() {
        this.reload();
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
    /**
     * @description Saves new data to file.
     */
    saveFile() {
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    reload() {
        this.data = this.parseDataFile(this.path, {});
    }
}

module.exports = Store;