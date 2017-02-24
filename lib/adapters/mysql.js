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
            connectionLimit: this.config.pool,
            host: this.config.host,
            user: this.config.username,
            password: this.config.password,
            port: this.config.port || 3306,
            database: this.config.database,
            Promise: Promise
        });
    }

    close(conection) {
        return conection.end();
    }

    executeSelect(connection, query) {
        return connection.query(query)
            .then(function(result) {
                return result[0];
            });
    }

    executeInsert(connection, query) {
        return this.executeSelect(connection, query);
    }

    executeUpdate(connection, query) {
        return this.executeSelect(connection, query);
    }

    executeDelete(connection, query) {
        return this.executeSelect(connection, query);
    }

    getColumns(table) {
        return this.execute('SHOW FULL COLUMNS FROM ' + table)
            .then(function(columns) {
                var result = [];

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
