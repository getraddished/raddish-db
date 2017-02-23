'use strict';

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
        this.connection = this.connect();
        this.type = '';
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

    /**
     * This method will execute a query on the database.
     * This method also needs to be overwritten per adapter.
     *
     * @param  {query} query The query to execute.
     * @return {Promise}       The promise containing the result of the query.
     */
    execute() {
        throw new TypeError('The execute method is to be overwritten per adapter!');
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
