'use strict';

var AbstractQuery = require('./abstract');

class AbstractDelete extends AbstractQuery {
    constructor() {
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
     * @param  {String}     constraint  The constraint of the filter.
     * @param  {String}     value       The value of the filter.
     * @param  {String}     next        The next selector.
     * @return {*}                      The current object for chaining.
     */
    where(column, constraint, value, next) {
        this.query.where.push({
            column: column,
            constraint: (Array.isArray(value) ? 'IN' : constraint),
            value: value,
            next: (next || 'AND')
        });

        return this;
    }
}

module.exports = AbstractDelete;