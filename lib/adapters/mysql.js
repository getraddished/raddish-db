'use strict';

var Abstract = require('./abstract'),
    mysql = require('mysql2/promise'),
    pool = require('generic-pool');

class MysqlAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        return pool.createPool({
            create: function() {
                return mysql.createConnection({
                    connectionLimit: this.config.pool,
                    host: this.config.host,
                    user: this.config.username,
                    password: this.config.password,
                    port: this.config.port || 3306,
                    database: this.config.database,
                    Promise: Promise
                });
            }.bind(this),
            destroy: function(client) {
                return client.end();
            }
        }, {
            min: 1,
            max: this.config.pool || 1
        });
    }

    execute(query) {
        query = (typeof query === 'string') ? query : this.getBuilder().build(query);

        var self = this;

        return this.getConnection()
            .then(function(connection) {
                return connection.query(query)
                    .then(function(results) {
                        self.releaseConnection(connection);
                        return results[0];
                    });
            });
    }

    getColumns(table) {
        var result = [];

        return this.execute('SHOW FULL COLUMNS FROM ' + table)
            .then(function(columns) {
                for(var column of columns) {
                    result.push({
                        name: column.Field,
                        unique: (column.Key == 'PRI' || column.Key == 'UNI') ? 1 : 0,
                        autoinc: (column.Extra.indexOf('auto_increment') != -1) ? 1 : 0,
                        value: column.Default,
                        type: column.Type
                    });
                }

                return result;
            });
    }

    getInsertedId(result) {
        return result.insertId;
    }
}

module.exports = MysqlAdapter;
