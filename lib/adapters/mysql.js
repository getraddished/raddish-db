'use strict';

var Abstract = require('./abstract'),
    mysql = require('mysql2/promise');

/**
 * This is the MySQL adapter all mysql related methods are located in here.
 *
 * @class MysqlAdapter
 */
class MysqlAdapter extends Abstract {
    constructor(config) {
        super(config);

        this.type = 'mysql';
    }

    /**
     * This is an override of the abstract connect method,
     * when called a new MySQL connection is returned.
     *
     * @method connect
     * @return {Promise} A promise containing the MongoDB Client.
     */
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

    /**
     * This is an override of the abstract close method and it will close the MySQL connection.
     *
     * @method close
     * @param connection The connection to close.
     * @return {Promise} A promise containing the closed connection.
     */
    close(conection) {
        return conection.end();
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
        return connection.query(query)
            .then(function(result) {
                return result[0];
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
        return this.executeSelect(connection, query);
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

    /**
     * This method will return the id of the insert result.
     *
     * @method getInsertedId
     * @param {Number} result The result of the executeInsert method.
     * @return {ObjectId} The id of the inserted object.
     */
    getInsertedId(result) {
        return result.insertId;
    }
}

module.exports = MysqlAdapter;
