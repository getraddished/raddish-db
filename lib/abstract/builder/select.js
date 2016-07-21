function AbstractSelect() {
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
AbstractSelect.prototype.select = function(name, alias) {
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
};

/**
 * This is the abstract from function.
 * The system is build to only allow for a single from table. This to keep the API for mongo and the rest in one line.
 * The other table need to be joined or added in subselectors.
 *
 * @param  {String} table       The table to select from.
 * @param  {String} alias       The alias for the selected table.
 * @return {*}                  The current object for chaining.
 */
AbstractSelect.prototype.from = function(table, alias) {
    this.query.from = {
        table: table,
        alias: alias
    };

    return this;
};

AbstractSelect.prototype.where = function(query, next) {
    this.query.where.push({
        query: query,
        next: (next || 'AND')
    });

    return this;
};

/**
 * This is a convenience method for the toQuery method.
 *
 * @return {*}              The query to execute.
 */
AbstractSelect.prototype.toString = function() {
    return this.toQuery();
};

/**
 * This method will return the query in query form for the selected database adapter.
 *
 * @return {*} The query to execute on the selected adapter.
 */
AbstractSelect.prototype.toQuery = function() {
    throw new Error('This method must be overwritten per query builder!');
};

module.exports = AbstractSelect;
