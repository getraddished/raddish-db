function AbstractUpdate() {
    this.query = {
        table: '',
        set: [],
        where: []
    }
}

AbstractUpdate.prototype.table = function(table) {
    this.query.table = table;

    return this;
};

AbstractUpdate.prototype.set = function(column, value) {
    this.query.set.push({
        column: column,
        value: value
    });

    return this;
};

/**
 * The where function will add a filter to the query.
 *
 * @param  {String}     column      The column to filter on.
 * @param  {String}     constraint  The constraint of the filter.
 * @param  {String}     value       The value of the filter.
 * @param  {String}     next        The next selector.
 * @return {*}                      The current object for chaining.
 */
AbstractUpdate.prototype.where = function(column, constraint, value, next) {
    // I want this function to be better, but also to suited for other adapters.

    this.query.where.push({
        column: column,
        constraint: (Array.isArray(value) ? 'IN' : constraint),
        value: value,
        next: (next || 'AND')
    });

    return this;
};

AbstractUpdate.prototype.toQuery = function() {
    return '';
};

AbstractUpdate.prototype.quoteName = function(name) {
    if(name.indexOf('AS') > -1 || name.indexOf('.') > -1) {
        name = name.replace(/\b(\w+) AS (\w+)\b/g, '`$1` AS `$2`');
        name = name.replace(/\bAS (\w+)\b/g, 'AS `$1`');
        name =  name.replace(/\b(\w+)\.(\w+)\b/g, '`$1`.`$2`');

        return name.replace(/\b(\w+)\b\.\*/g, '`$1`.*');
    } else if(name !== '*') {
        return '`' + name + '`';
    } else {
        return name;
    }
};

AbstractUpdate.prototype.escape = function(value) {
    if(Array.isArray(value)) {
        var escaped = value.map(function(value) {
            return this.escape(value);
        }.bind(this));

        return '(' + escaped.join(', ') + ')';
    } else if(typeof value !== 'string' && value !== null) {
        value = value.toString();
    } else if(value === null) {
        value = 'null';
    }

    return '\'' + value.replace(/[\/\\^$*+?.()|[\]{}'"]/g, '\\$&') + '\'';
};

module.exports = AbstractUpdate;