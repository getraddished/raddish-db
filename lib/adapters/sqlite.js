'use strict';

var Abstract = require('./abstract'),
    sqlite = require('sqlite3'),
    pool = require('generic-pool');

class SqliteAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        return pool.createPool({
            create: function() {
                return new Promise(function(resolve, reject) {
                    try {
                        var conn = new sqlite.Database(this.config.host);

                        return resolve(conn);
                    } catch(err) {
                        return reject(err);
                    }
                }.bind(this));
            }.bind(this),
            destroy: function(client) {
                return new Promise(function(resolve, reject) {
                    client.close(function(err) {
                        if(err) {
                            return reject(err);
                        }

                        return resolve();
                    });
                });
            }
        }, {
            min: 1,
            max: this.config.pool || 1
        });
    }

    execute(query) {
        var isInsert = (query.type === 'insert'),
            self = this;

        query = (typeof query === 'string') ? query : this.getBuilder().build(query);

        if(isInsert) {
            return this.getConnection()
                .then(function(connection) {
                    return new Promise(function(resolve, reject) {
                        connection.run(query, function(err) {
                            if(err) {
                                return reject(err);
                            }

                            self.releaseConnection(connection);
                            return resolve(this);
                        });
                    });
                });
        }

        return this.getConnection()
            .then(function(connection) {
                return new Promise(function(resolve, reject) {
                    connection.all(query, function(err, results) {
                        if(err) {
                            return reject(err);
                        }

                        self.releaseConnection(connection);
                        return resolve(results);
                    });
                });
            });
    }

    getColumns(table) {
        return this.execute('PRAGMA table_info(' + table + ')')
            .then(function(columns) {
                var result = [];

                for(var column of columns) {
                    result.push({
                        name: column.name,
                        unique: column.pk,
                        autoinc: column.pk,
                        value: column.dflt_value,
                        type: column.type
                    });
                }

                return result;
            });
    }

    getInsertedId(result) {
        return result.lastID;
    }
}

module.exports = SqliteAdapter;