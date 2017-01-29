'use strict';

var AbstractAdapter = require('./abstract'),
    MongoClient = require('mongodb').MongoClient;

class MongoAdapter extends AbstractAdapter {
    constructor(config) {
        super(config);

        this.type = 'mongo';
    }

    connect() {
        var self = this,
            auth = (self.config.username && self.config.password) ? self.config.username + ':' + self.config.password + '@' : '',
            url = 'mongodb://' + auth + self.config.host + ':' + (self.config.port || 27017) + '/' + self.config.database;

        return new Promise(function(resolve, reject) {
            MongoClient.connect(url, function(err, db) {
                if(err) {
                    return reject(err);
                }

                return resolve(db);
            });
        });
    }

    execute(query) {
        // We have a few different types of query.
        // So we will try to make a destinction.
        query = typeof query.toQuery === 'function' ? query.toQuery() : query;

        // Execute specialized method.
        var method = query.method.substr(0,1).toUpperCase() + query.method.substr(1);
        return this['execute' + method](query);
    }

    executeFind(query) {
        return this.getConnection()
            .then(function(connection) {
                return connection.collection(query.collection).find(query.query);
            })
            .then(function(cursor) {
                cursor.limit(query.limit);
                cursor.skip(query.offset);

                return cursor.toArray();
            })
            .then(function(items) {
                return items;
            });
    }

    executeInsert(query) {
        return this.getConnection()
            .then(function(connection) {
                return connection.collection(query.collection).insertOne(query.query);
            })
            .then(function(item) {
                return item;
            });
    }

    getColumns(table) {
        return this.getConnection()
            .then(function(connection) {
                return connection.collection(table).findOne();
            })
            .then(function(item) {
                var columns = [];

                if(!item) {
                    columns.push({
                        name: '_id',
                        unique: true,
                        autoinc: true,
                        value: null,
                        type: 'int'
                    });
                } else {
                    for(var index in item) {
                        if(item.hasOwnProperty(index)) {
                            columns.push({
                                name: index,
                                unique: index === '_id' ? true : false,
                                autoinc: index === '_id' ? true : false,
                                value: null,
                                type: (typeof item[index])
                            });
                        }
                    }
                }

                return columns;
            });
    }

    getInsertedId(result) {
        return result.insertedId;
    }
}

module.exports = MongoAdapter;
