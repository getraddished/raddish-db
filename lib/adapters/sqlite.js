'use strict';

var Abstract = require('./abstract'),
    sqlite = require('sqlite3');

/**
 * This is the SQLite adapter all related methods are located in here.
 *
 * @class SqliteAdapter
 */
class SqliteAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    /**
     * This is an override of the abstract connect method,
     * when called a new SQLite connection is returned.
     *
     * @method connect
     * @return {Promise} A promise containing the MongoDB Client.
     */
    connect() {
        return new Promise(function(resolve, reject) {
            try {
                return resolve(new sqlite.Database(this.config.host));
            } catch(err) {
                return reject(err);
            }
        }.bind(this));
    }

    /**
     * This is an override of the abstract close method and it will close the SQLite connection.
     *
     * @method close
     * @param connection The connection to close.
     * @return {Promise} A promise containing the closed connection.
     */
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

    /**
     * Override for the SQLite adapter,
     * sqlite over ssh doesn't work!
     *
     * @method createSshTunnel
     * @return {boolean}
     */
    createSshTunnel() {
        return false;
    }

    /**
     * This method will execute a Find query.
     *
     * @method executeFind
     * @param {Connection} connection The connection to the database.
     * @param {SelectQuery} query The query to execute.
     * @return {Promise} A promise containing the result fo the call.
     */
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

    /**
     * This is an override of the abstract executeInsert,
     * It will execute an insert query and return the result of the call.
     *
     * @method executeInsert
     * @param {Connection} connection The connection to the database.
     * @param {InsertQuery} query The query to execute.
     * @return {Promise} A promise containing the result of the call.
     */
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

    /**
     * This is an override of the abstract executeUpdate.
     * It will execute an update statement on a single object.
     *
     * @method executeUpdate
     * @param {Connection} connection The connection to the database.
     * @param {UpdateQuery} query The query to execute.
     * @return {Promise} A promise containing the result of the call.
     */
    executeUpdate(connection, query) {
        return this.executeSelect(connection, query);
    }

    /**
     * This is an override of the abstract executeDelete.
     * It will execute a delete statement on a single object.
     *
     * @method executeDelete
     * @param {Connection} connection The connection to the database.
     * @param {DeleteQuery} query The query to execute.
     * @return {Promise} A promise containing the result of the call.
     */
    executeDelete(connection, query) {
        return this.executeSelect(connection, query);
    }

    /**
     * This method will retrieve all the columns from the database together with their characteristics.
     *
     * @method getColumns
     * @param {String} table The table name to get all the columns from.
     * @return {Promise} A promise containing all the columns of the table in array form.
     */
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

    /**
     * This method will return the id of the insert result.
     *
     * @method getInsertedId
     * @param {Number} result The result of the executeInsert method.
     * @return {ObjectId} The id of the inserted object.
     */
    getInsertedId(result) {
        return result.lastID;
    }
}

module.exports = SqliteAdapter;