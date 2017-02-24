'use strict';

var Abstract = require('./abstract'),
    sqlite = require('sqlite3');

class SqliteAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        return new Promise(function(resolve, reject) {
            try {
                var conn = new sqlite.Database(this.config.host);

                return resolve(conn);
            } catch(err) {
                return reject(err);
            }
        }.bind(this));
    }

    close(connection) {
        return new Promise(function(resolve, reject) {
            connection.close(function(err) {
                if(err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    executeSelect(connection, query) {
        return new Promise(function(resolve, reject) {
            connection.all(query, function(err, results) {
                if(err) {
                    return reject(err);
                }

                return resolve(results);
            });
        });
    }

    executeInsert(connection, query) {
        return new Promise(function(resolve, reject) {
            connection.run(query, function(err) {
                if(err) {
                    return reject(err);
                }

                return resolve(this);
            });
        });
    }

    executeUpdate(connection, query) {
        return this.executeSelect(connection, query);
    }

    executeDelete(connection, query) {
        return this.executeSelect(connection, query);
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