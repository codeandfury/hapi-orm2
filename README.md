# hapi-orm

This is a plugin for [HAPI](http://hapijs.com/) v6 or 7 to connect to a database using [ORM](https://github.com/dresende/node-orm2). 

## Install

You can add the module to your HAPI project using npm:

    $ npm install hapi-orm --save

## Adding the plug-in into your project

In your server init file, add the following code after you have created the `server` object (provided options are plugin defaults):

    server.pack.register({
        plugin: require('hapi-orm'),
        options: {
            host: 'localhost',
            database: 'myDatabase',
            user: null,
            password: null,
            protocol: 'mysql',
            socketPath: null,
            port: 3306,
            debug: false,
            pool: false,
            strdates: false,
            timezone: 'local'
        }
    }, function(err) {
        if (err) {
            server.log('hapi-orm error: ' + err);
        }
    });

## Usage

Your request object should now be decorated with the db property. It will contain the orm connection, and models (if provided)

    function incomingRequest(request, reply) {
        var orm = request.server.plugins['hapi-orm'].db;
        // TODO: Add your code
        reply();
    }