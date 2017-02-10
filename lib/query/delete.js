'use strict';

var Helper = require('./helpers');

class DeleteQuery extends Abstract.Wherable {
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