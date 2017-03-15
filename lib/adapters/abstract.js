'use strict';

var pool = require('generic-pool'),
    tunnel = require('tunnel-ssh');

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

        if(config.ssh) {
            this.createSshTunnel(config);
        }

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
     * @method connect
     * @return {*} The connected adapter.
     */
    connect() {
        throw new TypeError('The connect method is to be overwritten per adapter!');
    }

    /**
     * The close method closes the connection.
     *
     * @method close
     * @param {Connection} The database connection to close
     */
    close() {
        throw new TypeError('The connect method is to be overwritten per adapter!');
    }

    /**
     * This method creates the SSH tunnel to the external server.
     *
     * @method createSshTunnel
     * @param {Object} config The config for the current adapter.
     * @return {Object} The tunnel object.
     */
    createSshTunnel(config) {
        // The tunnel must only be created, nothing is to be checked.
        return tunnel({
            username: config.ssh.username,
            password: config.ssh['password'] ? config.ssh.password : null,
            privateKey: config.ssh['privateKey'] ? require('fs').readFileSync(config.ssh.privateKey) : null,
            host: config.ssh.host,
            port: config.ssh.port,
            dstHost: config.host,
            dstPort: config.port,
            localHost: config.host,
            localPort: config.port = config.port + 1,
            keepAlive: true
        });
    }

    /**
     * This method will execute a query on the database.
     *
     * @method execute
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
     * @method executeSelect
     * @param {Connection} connection The connection to run the query on.
     * @param {Query} query A select query object to execute.
     * @return A promise containing the result of the query method.
     */
    executeSelect() {
        throw new TypeError('The executeSelect method is to be overwritten per adapter!');
    }

    /**
     * This method will execute an insert query.
     *
     * @method executeInsert
     * @param {Connection} connection The connection to run the query on.
     * @param {Query} query A select query object to execute.
     * @return A promise containing the result of the query method.
     */
    executeInsert() {
        throw new TypeError('The executeInsert method is to be overwritten per adapter!');
    }

    /**
     * This method will execute an update query.
     *
     * @method executeUpdate
     * @param {Connection} connection The connection to run the query on.
     * @param {Query} query A select query object to execute.
     * @return A promise containing the result of the query method.
     */
    executeUpdate() {
        throw new TypeError('The executeUpdate method is to be overwritten per adapter!');
    }

    /**
     * This method will execute a delete query.
     *
     * @method executeDelete
     * @param {Connection} connection The connection to run the query on.
     * @param {Query} query A select query object to execute.
     * @return A promise containing the result of the query method.
     */
    executeDelete() {
        throw new TypeError('The executeDelete method is to be overwritten per adapter!');
    }

    /**
     * This method will return the connection to the database.
     *
     * @method getConnection
     * @return {*} The connection to the database.
     */
    getConnection() {
        return this.connection.acquire();
    }

    /**
     * This method releases the connection to the pool.
     * When the connection is released the connection can be used for another call.
     *
     * @method releaseConnection
     * @param {Connection} connection The connection to return to the pool
     * @return {Adapter} The current adapter.
     */
    releaseConnection(connection) {
        this.connection.release(connection);
        
        return this;
    }

    /**
     * The getBuilder method will return the query builder with an optional type parameter.
     * The type parameter will be one of the actions (insert, select, update or delete) nothing or another string
     * is given the complete query builder will be returned.
     *
     * @method getBuilder
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
