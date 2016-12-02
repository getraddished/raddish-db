'use strict';

var AbstractQuery = require('./abstract');

class AbstractSelect extends AbstractQuery {
    constructor() {
        this.query = {
            columns: [],
            from: {},
            where: []
        }
    }

    /**
     * The select method specifies the columns to select.
     *
     * @param  {String|Array} name  The name of the column to select or an array of columns.
     * @param  {String|null} alias  The alias of the column to select when needed.
     * @return {MysqlSelect}        The current object for chaining.
     */
    select(name, alias) {
        if(Array.isArray(name)) {
            for(var index in name) {
                if(name.hasOwnProperty(index)) {
                    this.select(name.name, (name.alias ? name.alias : null));
                }
            }
        }

        if(!this.query.columns[name]) {
            this.query.columns.push({
                name: name,
                alias: alias
            });
        }

        return this;
    }

    /**
     * This is the abstract from function.
     * The system is build to only allow for a single from table. This to keep the API for mongo and the rest in one line.
     * The other table need to be joined or added in subselectors.
     *
     * @param  {String} table       The table to select from.
     * @param  {String} alias       The alias for the selected table.
     * @return {*}                  The current object for chaining.
     */
    from(table, alias) {
        this.query.from = {
            table: table,
            alias: alias
        };

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

module.exports = AbstractSelect;
