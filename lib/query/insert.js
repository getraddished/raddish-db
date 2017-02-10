'use strict';

var Setable = require('./abstract').Setable;

class InsertQuery extends Setable {
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
