'use strict';

var AbstractSelect = require('./../abstract/select');

class MysqlSelect extends AbstractSelect {
    toQuery() {
        var sql = 'SELECT ',
            columns = this.query.columns,
            cols = [],
            where = this.query.where;

        for(var index in columns) {
            if(columns.hasOwnProperty(index)) {
                var column = columns[index];

                cols.push(this.quoteName(column.name + (column.alias ? ' AS ' + column.alias : '')));
            }
        }
        sql += cols.join(', ') + ' FROM ' + this.quoteName((this.query.from.table) + (this.query.from.alias ? ' AS ' + this.query.from.alias : ''));

        if(where.length) {
            sql += ' WHERE';

            var last = (where.length - 1);
            for(var index in where) {
                if(where.hasOwnProperty(index)) {
                    sql += ' (' + where[index].column + ' ' + where[index].constraint + ' ' + (Array.isArray(where[index].value) ? ('(' + where[index].value + ')') : this.escape(where[index].value))  + ')';

                    if(index < last) {
                        sql += ' ' + where[index].next;
                    }
                }
            }
        }

        return sql;
    }
}

module.exports = MysqlSelect;
