'use strict';

var Abstract = require('./../abstract/adapter'),
    mysql = require('mysql');

class MysqlAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        var connection = mysql.createConnection({
            host: this.config.host,
            user: this.config.username,
            password: this.config.password,
            port: this.config.port || 3306,
            database: this.config.database
        });

        return new Promise(function(resolve, reject) {
            connection.connect(function(err) {
                if(err) {
                    return reject(err.message);
                }

                return resolve(connection);
            });
        });
    }

    execute(query) {
        query = (typeof query == 'string') ? query : query.toQuery();

        return this.getConnection()
            .then(function(connection) {
                return new Promise(function(resolve, reject) {
                    connection.query(query, function(err, results) {
                        if(err) {
                            return reject(err);
                        }

                        return resolve(results);
                    });
                });
            });
    }

    getColumns() {
        return {};
    }
}

module.exports = MysqlAdapter;
