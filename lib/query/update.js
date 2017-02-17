'use strict';

var Abstract = require('./abstract');

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

    table(table) {
        this.query.table = table;

        return this;
    }
}

module.exports = UpdateQuery;