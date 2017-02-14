'use strict';

var Abstract = require('./abstract'),
    sqlite = require('sqlite');

class SqliteAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    connect() {
        return sqlite.open(this.config.host);
    }

    execute(query) {
        var isInsert = (query.type === 'insert');

        query = (typeof query === 'string') ? query : this.getBuilder().build(query);

        if(isInsert) {
            return this.getConnection()
                .then(function(connection) {
                    return connection.run(query);
                })
        }

        return this.getConnection()
            .then(function(connection) {
                return connection.all(query);
            })
            .then(function(results) {
                return results;
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
        return result.stmt.lastID;
    }
}

module.exports = SqliteAdapter;