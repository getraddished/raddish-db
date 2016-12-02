'use strict';

var Abstract = require('./../abstract/adapter')
    mysql = require('mysql2');

class MysqlAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        var connection = mysql.createConnection({
            host: self.config.host,
            user: self.config.username,
            password: self.config.password,
            port: self.config.port || 3306,
            database: self.config.database
        });

        return new Promise(function(resolve, reject) {
            connection.connect(function(err) {
                if(err) {
                    return reject(err);
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
                    connection.query(query, function(err, result) {
                        if(err) {
                            return reject(err);
                        }

                        return resolve(result);
                    });
                });
            });
    }

    getColumns() {
        return {};
    }
}

module.exports = MysqlAdapter;
