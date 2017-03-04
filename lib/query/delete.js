'use strict';

var Abstract = require('./abstract');

/**
 * The DeleteQuery class will create a delete object which in turn can be passed to the builder.
 *
 * @class DeleteQuery
 */
class DeleteQuery extends Abstract.mixin(Abstract.Wherable) {
    constructor() {
        super();

        this.type = 'delete';
        this.query = {
            table: '',
            where: []
        };
    }

    /**
     * Set the query to delete from.
     *
     * @method from
     * @param {String} table The table to delete from.
     * @return {DeleteQuery} The current object for chaining.
     */
    from(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = DeleteQuery;