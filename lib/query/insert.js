'use strict';

class InsertQuery {
    constructor() {
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

    set(column, value) {
        this.query.set.push({
            column: column,
            value: value
        });

        return this;
    }
}

module.exports = InsertQuery;
