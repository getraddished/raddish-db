'use strict';

var Helper = require('./helpers'),
    Abstract = require('./abstract');

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
            group: []
        };
        this.last = '';
    }

    /**
     * The select method specifies the columns to select.
     *
     * @param  {String|Array} name  The name of the column to select or an array of columns.
     * @param  {String|null} alias  The alias of the column to select when needed.
     * @return {MysqlSelect}        The current object for chaining.
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
     * This is the abstract from function.
     * The system is build to only allow for a single from table. This to keep the API for mongo and the rest in one line.
     * The other table need to be joined or added in subselectors.
     *
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
     * This method preforms a inner join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    innerJoin(table, alias) {
        return this.join('inner', table, alias);
    }

    /**
     * This method preforms a right outer join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    rightOuterJoin(table, alias) {
        return this.join('right outer', table, alias);
    }

    /**
     * This method preforms a right join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    rightJoin(table, alias) {
        return this.join('right', table, alias);
    }

    /**
     * This method preforms a left outer join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    leftOuterJoin(table, alias) {
        return this.join('left outer', table, alias);
    }

    /**
     * This method preforms a left join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    leftJoin(table, alias) {
        return this.join('left', table, alias);
    }

    /**
     * This method preforms a full outer join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    fullOuterJoin(table, alias) {
        return this.join('full outer', table, alias);
    }

    /**
     * This method preforms a full join.
     *
     * @param {String} table The table to join.
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    fullJoin(table, alias) {
        return this.join('full', table, alias);
    }

    /**
     * This is a generic join method, called by all the *join methods.
     *
     * @param {String} type Join type.
     * @param {String} table The table to join.
     * @return {Helper.Join} The Join helper
     */
    join(type, table) {
        this.last = 'join';

        var join = new Helper.Join(this, type, table);
        this.query.join.push(join);

        return join;
    }

    limit(limit) {
        this.query.limit = limit;
        
        return this;
    }

    offset(offset) {
        this.query.offset = offset;

        return this;
    }
}

module.exports = SelectQuery;
