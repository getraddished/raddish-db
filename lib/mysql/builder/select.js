var AbstractSelect = require('./../../abstract/builder/select'),
    util = require('util');

function MysqlSelect() {
    AbstractSelect.call(this);
}

util.inherits(MysqlSelect, AbstractSelect);

/**
 * This method will return the query in sql form.
 *
 * @return {String} The SQL string to execute.
 */
MysqlSelect.prototype.toQuery = function() {
    var sql = 'SELECT ',
        columns = this.query.columns,
        where = this.query.where,
        cols = [];

    for(var index in columns) {
        if(columns.hasOwnProperty(index)) {
            var column = columns[index];

            cols.push(column.name + (column.alias ? ' AS ' + column.alias : ''));
        }
    }
    sql += cols.join(', ') + ' FROM ' + this.query.from.table + (this.query.from.alias ? ' AS ' + this.query.from.alias : '');

    if(where.length > 0) {
        sql += ' WHERE';

        var last = (where.length - 1);
        for(var index in where) {
            if(where.hasOwnProperty(index)) {
                sql += ' (' + where[index].query + ')';

                if(index < last) {
                    sql += ' ' + where[index].next;
                }
            }
        }
    }

    return sql;
};

module.exports = MysqlSelect;
