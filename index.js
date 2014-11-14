var fs     = require('fs'),
    path   = require('path'),
    orm    = require('orm'),
    config = {
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
        };

exports.register = function (plugin, options, next) {
    
    Object.keys(options).forEach(function(k) {
        if (config[k] !== undefined) {
            config[k] = options[k];
        }
    });

    var models = {};
        sequelize = new Sequelize(config.database, config.username, config.password, {
            dialect: config.dialect,
            port: config.port,
            host: config.host,
            logging: config.logging,
            native: config.native
        });

    orm.connect({
        host:       config.host,
        database:   config.database,
        user:       config.user,
        password:   config.password,
        protocol:   config.protocol,
        socketPath: config.socketPath,
        port:       config.port,
        query: {
            debug:    config.debug,
            pool:     config.pool,
            strdates: config.strdates,
            timezone: config.timezone
        }
    }, function(err, db) {
        if (!!err) {
            plugin.log(['hapi-orm', 'error'], 'Error connecting to database. ' + err);
            return next(err);
        }
        if (config.models) {
            config.models = path.resolve(config.models);
            fs.readdirSync(config.models).forEach(function(file) {
                if (file.toLowerCase() !== config.associationFile) {
                    var model = require(path.join(config.models, file));

                    models[model.name] = 
                        db.define(model.name, model.model, model.options);
                }
            });
            /*if (fs.existsSync(path.join(config.models, config.associationFile))) {
                var associations = require(path.join(config.models, config.associationFile)),
                    assoc = null;

                for (var i = 0, length = associations.length; i < length; i ++) {
                    assoc = associations[i];
                    if (models[assoc.source] && models[assoc.target]) {
                        assoc.options = assoc.options || {};
                        if (assoc.options.through && assoc.options.through.model) {
                            assoc.options.through.model = models[assoc.options.through.model];
                        }

                        switch (assoc.type) {
                            case 'oneone':
                                models[assoc.source].hasOne(models[assoc.target], assoc.options);
                                models[assoc.target].belongsTo(models[assoc.source], assoc.options);
                                break;
                            case 'onemany':
                                models[assoc.source].hasMany(models[assoc.target], assoc.options);
                                models[assoc.target].belongsTo(models[assoc.source], assoc.options);
                                break;
                            case 'manymany':
                                models[assoc.source].hasMany(models[assoc.target], assoc.options);
                                models[assoc.target].hasMany(models[assoc.source], assoc.options);
                                break;
                        }
                    }
                }
            }*/
        }
        plugin.expose('db', db);
        plugin.expose('models', models);
        
        next();
    });
};

exports.register.attributes = {
    pkg: require('./package.json')
};
