var Abstract = require('./../abstract/adapter'),
    util = require('util'),
    mysql = require('mysql2');

function MysqlAdapter(config) {
    Abstract.call(this, config);

    this.type = 'mysql';
}

util.inherits(MysqlAdapter, Abstract);

MysqlAdapter.prototype.connect = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        var connection = mysql.createConnection({
            host: self.config.host,
            user: self.config.username,
            password: self.config.password,
            port: self.config.port || 3306,
            database: self.config.database
        });

        return connection.connect(function(err) {
            if(err) {
                return reject(err);
            }

            return resolve(connection);
        });
    });
};

MysqlAdapter.prototype.execute = function(query) {
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
};

module.exports = MysqlAdapter;
