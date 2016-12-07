'use strict';

var Abstract = require('./../abstract/adapter'),
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

    getColumns() {
        return {};
    }
}

module.exports = MysqlAdapter;
