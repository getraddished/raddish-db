'use strict';

var AbstractAdapter = require('./abstract'),
    MongoClient = require('mongodb').MongoClient;

/**
 * This is the MongoDB adapter of RaddishDB all mongo related methods are located in here.
 *
 * @class MongoAdapter
 */
class MongoAdapter extends AbstractAdapter {
    constructor(config) {
        super(config);

        this.isStrict = false;
        this.type = 'mongo';
    }

    /**
     * This is an override of the abstract connect method,
     * when called a new MongoDB Client is returned.
     *
     * @method connect
     * @return {Promise} A promise containing the MongoDB Client.
     */
    connect() {
        var auth = (this.config.username && this.config.password) ? this.config.username + ':' + this.config.password + '@' : '',
            url = 'mongodb://' + auth + this.config.host + ':' + (this.config.port || 27017) + '/' + this.config.database;

        return MongoClient.connect(url);
    }

    /**
     * This is an override of the abstract close method and it will close the MongoDB Client connection.
     *
     * @method close
     * @param connection The connection to close.
     * @return {Promise} A promise containing the closed connection.
     */
    close(connection) {
        return connection.close();
    }

    /**
     * Override the createSshTunnel to set the default port.
     *
     * @method createSshTunnel
     * @param {Object} config The config object of the current adapters
     * @return {*} The tunnel object.
     */
    createSshTunnel(config) {
        config.port = config.port || 27017;

        return super.createSshTunnel(config);
    }

    /**
     * This is an override of the main execute method,
     * An extra check is done for the query and the query is executed like normal.
     *
     * @method execute
     * @param {Query} query The query to execute.
     * @return {Promise} A promise containing the result.
     */
    execute(query) {
        query = this.getBuilder().build(query);

        // Execute specialized method.
        var method = query.method.substr(0, 1).toUpperCase() + query.method.substr(1),
            self = this;

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
     * This method will execute a Find query.
     *
     * @method executeFind
     * @param {Connection} connection The connection to the database.
     * @param {SelectQuery} query The query to execute.
     * @return {Promise} A promise containing the result fo the call.
     */
    executeFind(connection, query) {
        return connection
            .collection(query.collection)
            .find(query.query)
            .limit(query.limit)
            .skip(query.offset)
            .toArray();
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
        return connection.collection(query.collection).insertOne(query.query);
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
        return connection.collection(query.collection).updateOne(query.filter, {
            $set: query.set
        });
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
        return connection.collection(query.collection).deleteMany(query.query);
    }

    /**
     * This method will retrieve all the columns from the database together with their characteristics.
     *
     * @method getColumns
     * @param {String} table The table name to get all the columns from.
     * @return {Promise} A promise containing all the columns of the table in array form.
     */
    getColumns(table) {
        var self = this;

        return this.getConnection()
            .then(function(connection) {
                return connection.collection(table).findOne()
                    .then(function(result) {
                        self.releaseConnection(connection);

                        return result;
                    })
                    .catch(function(err) {
                        self.releaseConnection(connection);

                        throw err;
                    });
            })
            .then(function(item) {
                var columns = [];

                if(!item) {
                    columns.push({
                        name: '_id',
                        unique: true,
                        autoinc: true,
                        value: null,
                        type: 'int'
                    });
                } else {
                    for(var index in item) {
                        if(item.hasOwnProperty(index)) {
                            columns.push({
                                name: index,
                                unique: (index === '_id'),
                                autoinc: (index === '_id'),
                                value: null,
                                type: (typeof item[index])
                            });
                        }
                    }
                }

                return columns;
            });
    }

    /**
     * This method will return the id of the insert result.
     *
     * @method getInsertedId
     * @param {Result} result The result of the executeInsert method.
     * @return {ObjectId} The id of the inserted object.
     */
    getInsertedId(result) {
        return result.insertedId;
    }
}

module.exports = MongoAdapter;
