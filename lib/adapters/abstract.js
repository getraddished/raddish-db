'use strict';

var pool = require('generic-pool');

/**
 * The AbstractAdapter object in this case builds the SSH connection in case one is needed.
 * Also it keeps the most generic functions in the library.
 *
 * @class AbstractAdapter
 * @param {Object} config The config for the entire adapter.
 * @constructor
 */
class AbstractAdapter {
    constructor(config) {
        this.config = config;
        this.type = '';
        this.isStrict = true;

        // By default create a pool.
        this.connection = pool.createPool({
            create: this.connect.bind(this),
            destroy: this.close.bind(this)
        }, {
            min: 1,
            max: config.pool || 1
        });
    }

    /**
     * The connect method is to be overwritten per adapter,
     * this method will make a connection to the database.
     *
     * @return {*} The connected adapter.
     */
    connect() {
        throw new TypeError('The connect method is to be overwritten per adapter!');
    }

    close() {
        throw new TypeError('The connect method is to be overwritten per adapter!');
    }

    /**
     * This method will execute a query on the database.
     *
     * @param  {query} query The query to execute.
     * @return {Promise}       The promise containing the result of the query.
     */
    execute(query) {
        var method = query['type'] ? (query.type.charAt(0).toUpperCase() + query.type.slice(1)) : 'Select',
            self = this;

        query = query['type'] ? this.getBuilder().build(query) : query;

        return this.getConnection()
            .then(function(connection) {
                return self['execute' + method](connection, query)
                    .then(function(result) {
                        self.releaseConnection(connection);

                        return result;
                    })
                    .catch(function(err) {
                        self.releaseConnection(connection);

                        throw err;
                    });
            });
    }

    /**
     * This method will execute a select query.
     *
     * @param {Connection} connection The connection to run the query on.
     * @param {Query} query A select query object to execute.
     * @return A promise containing the result of the query method.
     */
    executeSelect() {
        throw new TypeError('The executeSelect method is to be overwritten per adapter!');
    }

    executeInsert() {
        throw new TypeError('The executeInsert method is to be overwritten per adapter!');
    }

    executeUpdate() {
        throw new TypeError('The executeUpdate method is to be overwritten per adapter!');
    }

    executeDelete() {
        throw new TypeError('The executeDelete method is to be overwritten per adapter!');
    }

    /**
     * This method will return the connection to the database.
     *
     * @return {*} The connection to the database.
     */
    getConnection() {
        return this.connection.acquire();
    }

    releaseConnection(connection) {
        return this.connection.release(connection);
    }

    /**
     * The getBuilder method will return the query builder with an optional type parameter.
     * The type parameter will be one of the actions (insert, select, update or delete) nothing or another string
     * is given the complete query builder will be returned.
     *
     * @returns {*} The query builder object.
     */
    getBuilder() {
        try {
            return new (require('../builders/' + this.type));
        } catch(err) {
            throw new Error('Builder for ' + this.type + ' not found!');
        }
    }
}

module.exports = AbstractAdapter;
