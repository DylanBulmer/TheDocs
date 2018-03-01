## Application Setup

Download the latest version of the app under the releases page and run the setup application. Once this has been completed, run the installed application.

#### Setup for first-time users

The first window that will appear asks for the server's URL or IPv4 address, the address can be gained from your server administrator if you are using this app for work.
Next you will find a Login screen, at the bottom of the form you can find a register here button, click it and fill out the form. *The registration code can be gained from your server admin.*
Once registration has been completed you will be brought to the heart of the application. 

## Server Setup

**Before doing anything with the server, make sure that node.js is installed! You can download it here: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)**

For Server setup, go under releases and download the latest server zip. Inside the package you will find the following files: `start.bat`, `start.sh`, `config.json`, and then the server script and the rest of the server's contents.

Now extract the folder and place it where it will be running from. Next open a command prompt or a terminal and `cd` into the server's folder and run `npm install`. This will install all of the modules needed to run the server.

Now time for some fun! To start, here is some infromation about the `config.json` file. This is the server's configuration file, there are a few things you will want to change about it. The file should look like the following:

``` json
{
  "port": 1337,
  "url": "127.0.0.1",
  "host": "localhost",
  "secret": "secret_key",
  "code": "1234",
  "mysql": {
    "host": "localhost",
    "database": "thedocs",
    "user": "username",
    "password": "password"
  }
}
```

A one thing you should not change is the `port`, this is because the application right now does not have the ability to change what port to look for. 

You can change the rest. Some things to notice, there is a `url` and a `host` config, this is on purpose. These are the ways you can log into the server.
If you choose to have the server located on another machine besides your `localhost` then change the `url` to the machines internal IPv4 address and set the `host` to either its fully qualified domain name or its public IPv4 address
It is *recommended* for you to change the `secret` key so client sessions can't be attacked by a man-in-the-middle. Also you should change the `code`, the code is what clients will use to gain access to the server. **Treat it like you would a password!**
Next is the `mysql` setup, enter the `host`, `database` you want to access, the `user` to login to the database, and the user's `password`.

Now run the server!

For **Windows** users, double click the `start.bat` file, otherwise if you are a **Mac** or **Linux** user, double click the `start.sh` file. 