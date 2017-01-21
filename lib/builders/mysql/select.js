'use strict';

var AbstractSelect = require('./../abstract/select');

class MysqlSelect extends AbstractSelect {
    getConstraint(constraint) {
        switch(constraint) {
            case 'equals':
                return '=';
            case 'like':
                return 'LIKE';
            case 'in':
                return 'IN';
        }
    }

    toQuery() {
        var sql = 'SELECT ',
            columns = this.query.columns,
            cols = [],
            wheres = this.query.where,
            joins = this.query.join;

        for(var index in columns) {
            if(columns.hasOwnProperty(index)) {
                var column = columns[index];

                cols.push(this.quoteName(column.name + (column.alias ? ' AS ' + column.alias : '')));
            }
        }
        sql += cols.join(', ') + ' FROM ' + this.quoteName(this.query.from.table + (this.query.from.alias ? ' AS ' + this.query.from.alias : ''));

        if(joins.length) {
            for(var join of joins) {
                sql += ' ' + join.type.toUpperCase() + ' JOIN ' + this.quoteName(join.table  + (this.query.from.alias ? ' AS ' + this.query.from.alias : '')) + ' ON(' + join.set.source + ' = ' + join.set.target + ')';
            }
        }

        if(wheres.length) {
            sql += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                sql += ' (' + this.quoteName(where.column) + ' ' + this.getConstraint(where.type) + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(wheres.indexOf(where) < last) {
                    sql += ' ' + where.next.toUpperCase();
                }
            }
        }

        return sql;
    }
}

module.exports = MysqlSelect;
