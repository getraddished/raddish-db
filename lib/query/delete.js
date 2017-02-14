'use strict';

var Abstract = require('./abstract');

class DeleteQuery extends Abstract.Mixin(Abstract.Wherable) {
    constructor() {
        super();

        this.type = 'delete';
        this.query = {
            table: '',
            where: []
        };
    }

    from(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = DeleteQuery;