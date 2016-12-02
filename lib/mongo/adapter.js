'use strict';

var AbstractAdapter = require('./../abstract/adapter'),
    MongoClient = require('mongodb').MongoClient;

class MongoAdapter extends AbstractAdapter {
    constructor(config) {
        super(config);

        this.type = 'mongo';
    }

    connect() {
        var self = this,
            auth = (self.config.username && self.config.password) ? self.config.username + ':' + self.config.password + '@' : '',
            url = 'mongodb://' + auth + self.config.host + ':' + self.config.port + '/' + self.config.database;

        return new Promise(function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if(err) {
                    return reject(err);
                }

                return resolve(db);
            });
        });
    }
}

module.exports = MongoAdapter;
