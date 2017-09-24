'use strict';

var Helper = require('./helpers'),
    Abstract = require('./abstract');

/**
 * The SelectQuery class will create a delete object which in turn can be passed to the builder.
 * The SelectQuery extends the wherable Object to allow the setting of where and having methods.
 *
 * @class SelectQuery
 */
class SelectQuery extends Abstract.mixin(Abstract.Wherable) {
    constructor() {
        super();

        this.type = 'select';
        this.query = {
            columns: [],
            from: {},
            where: [],
            having: [],
            join: [],
            limit: 0,
            offset: 0,
            group: [],
            sort: [],
            count: {}
        };
        this.last = '';
    }

    /**
     * The select method specifies the columns to select.
     *
     * @method select
     * @param  {String|Array} name  The name of the column to select or an array of columns.
     * @param  {String|null} alias  The alias of the column to select when needed.
     * @return {SelectQuery}        The current object for chaining.
     */
    select(name, alias) {
        this.last = 'select';

        if(name.toString() === '[object Object]') {
            for(var index in name) {
                if(name.hasOwnProperty(index)) {
                    this.select(index, (name[index] || null));
                }
            }
        } else {
            if(!this.query.columns[name]) {
                this.query.columns.push({
                    name: name,
                    alias: alias
                });
            }
        }

        return this;
    }

    /**
     * This will turn the query into a count query, disregarding the columns selected.
     *
     * @param {String} column       The column to count on.
     * @param {String} alias        The alias of the count column.
     * @return {SelectQuery}        The current object for chaining.
     */
    count(column, alias) {
        this.query.count.column = column;
        this.query.count.alias = alias;

        return this;
    }

    /**
     * This is the abstract from function.
     * The system is build to only allow for a single from table. This to keep the API for mongo and the rest in one line.
     * The other table need to be joined or added in subselectors.
     *
     * @method from
     * @param  {String} table       The table to select from.
     * @param  {String} alias       The alias for the selected table.
     * @return {*}                  The current object for chaining.
     */
    from(table, alias) {
        this.last = 'from';

        this.query.from = {
            table: table,
            alias: alias
        };

        return this;
    }

    /**
     * This is a generic join method, called by all the *join methods.
     *
     * @method join
     * @param {String} type     Join type.
     * @param {String} table    The table to join.
     * @return {Helper.Join}    The Join helper
     */
    join(type, table) {
        this.last = 'join';

        var join = new Helper.Join(this, type, table);
        this.query.join.push(join);

        return join;
    }

    /**
     * This method will limit the results returned from the database.
     *
     * @method limit
     * @param {Number} limit The limit of the results.
     * @return {SelectQuery} The current object for chaining.
     */
    limit(limit) {
        this.query.limit = limit;
        
        return this;
    }

    /**
     * This method will specify how many elements to skip.
     *
     * @method offset
     * @param {Number} offset   The offset.
     * @return {SelectQuery}    The current object for chaining.
     */
    offset(offset) {
        this.query.offset = offset;

        return this;
    }

    /**
     * This method will add a sort clause to the query.
     *
     * @method sort
     * @param {String} column       The column to sort on.
     * @param {String} descending   If the direction is descending or not.
     * return {SelectQuery}         The current object for chaining
     */
    sort(column, descending) {
        this.query.sort.push({
            column: column,
            descending: descending
        });

        return this;
    }
}

module.exports = SelectQuery;
