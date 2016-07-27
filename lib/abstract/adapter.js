var Builder = require('../builder');

/**
 * The AbstractAdapter object in this case builds the SSH connection in case one is needed.
 * Also it keeps the most generic functions in the library.
 *
 * @class AbstractAdapter
 * @param {Object} config The config for the entire adapter.
 * @constructor
 */
function AbstractAdapter(config) {
    this.config = config;
    this.connection = this.connect();
}

/**
 * The connect method is to be overwritten per adapter,
 * this method will make a connection to the database.
 *
 * @return {*} The connected adapter.
 */
AbstractAdapter.prototype.connect = function() {
    throw new AssertionError('The connect method is to be overwritten per adapter!');
};

/**
 * This method will execute a query on the database.
 * This method also needs to be overwritten per adapter.
 *
 * @param  {query} query The query to execute.
 * @return {Promise}       The promise containing the result of the query.
 */
AbstractAdapter.prototype.execute = function(query) {
    throw new AssertionError('The execute method is to be overwritten per adapter!');
};

/**
 * This method will return the connection to the database.
 *
 * @return {*} The connection to the database.
 */
AbstractAdapter.prototype.getConnection = function() {
    return this.connection;
};

/**
 * The getBuilder method will return the query builder with an optional type parameter.
 * The type parameter will be one of the actions (insert, select, update or delete) nothing or another string
 * is given the complete query builder will be returned.
 *
 * @param {String} type An optional method to be called
 * @returns {*} The query builder object.
 */
AbstractAdapter.prototype.getBuilder = function(type) {
    return new Builder(this.type);
};

module.exports = AbstractAdapter;
