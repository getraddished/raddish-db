'use strict';

var AbstractBuilder = require('./abstract');

class MysqlBuilder extends AbstractBuilder {
    _getConstraint(constraint) {
        switch(constraint) {
            case 'equals':
                return '=';
            case 'like':
                return 'LIKE';
            case 'in':
                return 'IN';
        }
    }

    buildSelect(query) {
        var sql = 'SELECT ',
            columns = query.query.columns,
            cols = [],
            wheres = query.query.where,
            joins = query.query.join;

        for(var index in columns) {
            if(columns.hasOwnProperty(index)) {
                var column = columns[index];

                cols.push(this.quoteName(column.name + (column.alias ? ' AS ' + column.alias : '')));
            }
        }
        sql += cols.join(', ') + ' FROM ' + this.quoteName(query.query.from.table + (query.query.from.alias ? ' AS ' + query.query.from.alias : ''));

        if(joins.length) {
            for(var join of joins) {
                sql += ' ' + join.type.toUpperCase() + ' JOIN ' + this.quoteName(join.table  + (join.alias ? ' AS ' + join.alias : '')) + ' ON(' + join.set.source + ' = ' + join.set.target + ')';
            }
        }

        if(wheres.length) {
            sql += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                sql += ' (' + this.quoteName(where.column) + ' ' + this._getConstraint(where.type) + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(wheres.indexOf(where) < last) {
                    sql += ' ' + where.next.toUpperCase();
                }
            }
        }

        return sql;
    }

    buildInsert(query) {
        var keys = [],
            values = [],
            query = 'INSERT INTO ' + this.quoteName(query.query.table);

        for(var index in query.query.set) {
            if(query.query.set.hasOwnProperty(index)) {
                var set = query.query.set[index];

                keys.push(set.column);
                values.push(set.value);
            }
        }

        if(keys.length && values.length) {
            query += ' (' + keys.map(this.quoteName).join(',') + ') VALUES (' + values.map(this.escape).join(',') + ')';
        }

        return query;
    }

    buildUpdate(query) {
        var keys = [],
            values = [],
            query = 'UPDATE ' + this.quoteName(query.query.table),
            wheres = query.query.where;

        if(query.query.set.length) {
            query += ' SET';

            for(var index in query.query.set) {
                if(query.query.set.hasOwnProperty(index)) {
                    var set = query.set[index];

                    query += ' ' + this.quoteName(set.column) + ' = ' + this.escape(set.value);
                }
            }
        }

        if(wheres.length) {
            query += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                query += ' (' + this.quoteName(where.column) + ' ' + this._getConstraint(where.type) + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(wheres.indexOf(where) < last) {
                    query += ' ' + where.next.toUpperCase();
                }
            }
        }

        return query;
    }

    buildDelete(query) {
        var query = 'DELETE FROM ' + this.quoteName(query.query.table),
            wheres = query.query.where;

        if(wheres.length) {
            query += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                query += ' (' + this.quoteName(where.column) + ' ' + this._getConstraint(where.type) + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(wheres.indexOf(where) < last) {
                    query += ' ' + where.next.toUpperCase();
                }
            }
        }

        return query;
    }
}

module.exports = MysqlBuilder;