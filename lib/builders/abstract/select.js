'use strict';

var AbstractQuery = require('./abstract'),
    Helper = require('./../abstract/helpers');

class AbstractSelect extends AbstractQuery {
    constructor() {
        super();

        this.query = {
            columns: [],
            from: {},
            where: [],
            join: [],
            limit: 0,
            offset: 0
        }
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
        this.last = 'from';

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
     * @return {*}                      The current object for chaining.
     */
    where(column) {
        this.last = 'where';

        var where = new Helper.Where(this, column);
        this.query.where.push(where);

        return where;
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
     * @param {String} alias The alias of the joined table.
     * @return {Helper.Join} The Join helper
     */
    join(type, table, alias) {
        this.last = 'join';

        var join = new Helper.Join(this, type, table);
        this.query.join.push(join);

        return join;
    }

    /**
     * This method gives the previous called where query a and statement.
     * If no where statements exist, then we give an error.
     *
     * @return {AbstractSelect}
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
     * @return {AbstractSelect}
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

module.exports = AbstractSelect;
