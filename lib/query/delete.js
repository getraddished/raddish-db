'use strict';

var Helper = require('./helpers');

class DeleteQuery {
    constructor() {
        this.type = 'delete';
        this.query = {
            table: '',
            where: []
        }
    }

    from(table) {
        this.query.table = table;

        return this;
    }

    /**
     * The where function will add a filter to the query.
     *
     * @param  {String}     column      The column to filter on.
     * @return {*}                      The current object for chaining.
     */
    where(column, constraint, value, next) {
        this.last = 'where';

        var where = new Helper.Where(this, column);
        this.query.where.push(where);

        return where;
    }


    /**
     * This method gives the previous called where query a and statement.
     * If no where statements exist, then we give an error.
     *
     * @return {AbstractUpdate}
     */
    and() {
        // Get the last where query.
        if(this.query[this.last].length === 0) {
            throw new Error('No ' + this.last + ' clauses found!');
        }

        var item = this.query[this.last][this.query[this.last].length - 1];
        item.next = 'and';

        return this;
    }

    /**
     * This method gives the previous called where query a or statement.
     * If no where statements exist, then we give an error.
     *
     * @return {AbstractUpdate}
     */
    or() {
        if(this.query[this.last].length === 0) {
            throw new Error('No ' + this.last + ' clauses found!');
        }

        var item = this.query[this.last][this.query[this.last].length - 1];
        item.next = 'or';

        return this;
    }
}

module.exports = DeleteQuery;