'use strict';

var Abstract = require('./abstract'),
    mysql = require('mysql2/promise');

class MysqlAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        return mysql.createConnection({
            host: this.config.host,
            user: this.config.username,
            password: this.config.password,
            port: this.config.port || 3306,
            database: this.config.database,
            Promise: Promise
        });
    }

    execute(query) {
        query = (typeof query == 'string') ? query : query.toQuery();

        return this.getConnection()
            .then(function(connection) {
                return connection.query(query);
            })
            .then(function(results) {
                return results[0];
            });
    }

    getColumns(table) {
        var result = [];

        return this.getConnection()
            .then(function(connection) {
                return connection.query('SHOW FULL COLUMNS FROM ' + table);
            })
            .then(function(columns) {
                for(var column of columns[0]) {
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

    getIndexes() {

    }

    getInsertedId(result) {
        return result.insertId;
    }
}

module.exports = MysqlAdapter;
