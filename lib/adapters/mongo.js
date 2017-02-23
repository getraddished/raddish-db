'use strict';

var AbstractAdapter = require('./abstract'),
    MongoClient = require('mongodb').MongoClient,
    pool = require('generic-pool');

class MongoAdapter extends AbstractAdapter {
    constructor(config) {
        super(config);

        this.type = 'mongo';
    }

    connect() {
        var auth = (this.config.username && this.config.password) ? this.config.username + ':' + this.config.password + '@' : '',
            url = 'mongodb://' + auth + this.config.host + ':' + (this.config.port || 27017) + '/' + this.config.database;

        return pool.createPool({
            create: function() {
                return MongoClient.connect(url);
            },
            destroy: function(connection) {
                return connection.close();
            }
        }, {
            min: 1,
            max: this.config.pool || 1
        });
    }

    execute(query) {
        query = this.getBuilder().build(query);

        // Execute specialized method.
        var method = query.method.substr(0, 1).toUpperCase() + query.method.substr(1),
            self = this;

        return this.getConnection()
            .then(function(connection) {
                return self['execute' + method](connection, query)
                    .then(function(result) {
                        self.releaseConnection(connection);

                        return result;
                    });
            });
    }

    executeFind(connection, query) {
        var cursor = connection.collection(query.collection).find(query.query);
        cursor.limit(query.limit);
        cursor.skip(query.offset);

        return cursor.toArray();
    }

    executeInsert(connection, query) {
        return connection.collection(query.collection).insertOne(query.query);
    }

    executeUpdate(connection, query) {
        return connection.collection(query.collection).updateOne(query.filter, query.set);
    }

    executeDelete(connection, query) {
        return connection.collection(query.collection).deleteMany(query.query);
    }

    getColumns(table) {
        var self = this;

        return this.getConnection()
            .then(function(connection) {
                return connection.collection(table).findOne()
                    .then(function(result) {
                        self.releaseConnection(connection);

                        return result;
                    });
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
                                unique: (index === '_id'),
                                autoinc: (index === '_id'),
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
