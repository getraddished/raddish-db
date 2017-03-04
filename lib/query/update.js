'use strict';

var Abstract = require('./abstract');

/**
 * The UpdateQuery class will create a delete object which in turn can be passed to the builder.
 * The UpdateQuery extends the setable and wherable Object to allow the setting of values and the setting of where and having statements.
 *
 * @class UpdateQuery
 */
class UpdateQuery extends Abstract.mixin(Abstract.Setable, Abstract.Wherable) {
    constructor() {
        super();

        this.type = 'update';
        this.query = {
            table: '',
            set: [],
            where: [],
            having: [],
            group: []
        };
    }

    /**
     * This method will specify in which table the values need to be updated.
     *
     * @param {String} table The table in which the values need to be updated.
     * @return {InsertQuery} The current object for chaining.
     */
    table(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = UpdateQuery;