'use strict';

var Helper = require('./helpers'),
    Abstract = require('./abstract');

class UpdateQuery extends Abstract.Wherable with Abstract.Setable {
    constructor() {
        super();

        this.type = 'update';
        this.query = {
            table: '',
            set: [],
            where: []
        };
    }

    table(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = UpdateQuery;