'use strict';

var Abstract = require('./abstract');

/**
 * The InsertQuery class will create a delete object which in turn can be passed to the builder.
 * The InsertQuery extends the setable Object to allow the setting of values.
 *
 * @class InsertQuery
 */
class InsertQuery extends Abstract.mixin(Abstract.Setable) {
    constructor() {
        super();

        this.type = 'insert';
        this.query = {
            table: '',
            set: []
        };
    }

    /**
     * This method will specify in which table the values need to come.
     *
     * @param {String} table The table in which the values need to be inserted.
     * @return {InsertQuery} The current object for chaining.
     */
    into(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = InsertQuery;
