'use strict';

var Abstract = require('./abstract');

class InsertQuery extends Abstract.mixin(Abstract.Setable) {
    constructor() {
        super();

        this.type = 'insert';
        this.query = {
            table: '',
            set: []
        };
    }

    into(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = InsertQuery;
