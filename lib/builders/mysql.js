'use strict';

var AbstractBuilder = require('./abstract');

class MysqlBuilder extends AbstractBuilder {
    _getConstraint(constraint) {
        switch(constraint) {
        case 'equals':
            constraint = '=';
            break;
        case 'like':
            constraint = 'LIKE';
            break;
        case 'in':
            constraint = 'IN';
            break;
        }

        return constraint;
    }

    _buildWhereClause(wheres) {
        var sql = '';

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

    _buildHavingClause(havings) {
        var sql = '';

        if(havings.length) {
            sql += ' HAVING';

            var last = (havings.length - 1);
            for(var having of havings) {
                sql += ' (' + this.quoteName(having.column) + ' ' + this._getConstraint(having.type) + ' ' + (Array.isArray(having.value) ? ('(' + having.value + ')') : this.escape(having.value))  + ')';

                if(havings.indexOf(having) < last) {
                    sql += ' ' + having.next.toUpperCase();
                }
            }
        }

        return sql;
    }

    buildSelect(query) {
        var sql = 'SELECT ',
            columns = query.query.columns,
            cols = [],
            joins = query.query.join;

        for(var column of columns) {
            cols.push(this.quoteName(column.name) + (column.alias ? ' AS ' + this.quoteName(column.alias) : ''));
        }
        sql += cols.join(', ') + ' FROM ' + this.quoteName(query.query.from.table + (query.query.from.alias ? ' AS ' + query.query.from.alias : ''));

        if(joins.length) {
            for(var join of joins) {
                sql += ' ' + join.type.toUpperCase() + ' JOIN ' + this.quoteName(join.table  + (join.alias ? ' AS ' + join.alias : '')) + ' ON (' + this.quoteName(join.set.source) + ' = ' + this.quoteName(join.set.target) + ')';
            }
        }

        sql += this._buildWhereClause(query.query.where);

        if(query.query.group.length) {
            sql += ' GROUP BY';

            sql += query.query.group.map(function(key, item) {
                return item.column + ' ' + item.direction;
            }).join(',');
        }

        sql += this._buildHavingClause(query.query.having);

        if(query.query.limit) {
            sql += ' LIMIT ' + query.query.limit;

            if(query.query.offset) {
                sql += ',' + query.query.offset;
            }
        }

        return sql;
    }

    buildInsert(query) {
        var keys = [],
            values = [],
            sql = 'INSERT INTO ' + this.quoteName(query.query.table);

        for(var set of query.query.set) {
            keys.push(set.column);
            values.push(set.value);
        }

        if(keys.length && values.length) {
            sql += ' (' + keys.map(this.quoteName).join(',') + ') VALUES (' + values.map(this.escape).join(',') + ')';
        }

        return sql;
    }

    buildUpdate(query) {
        var sql = 'UPDATE ' + this.quoteName(query.query.table);

        if(query.query.set.length) {
            sql += ' SET';

            for(var set of query.query.set) {
                sql += ' ' + this.quoteName(set.column) + ' = ' + this.escape(set.value);
            }
        }

        sql += this._buildWhereClause(query.query.where);
        sql += this._buildHavingClause(query.query.having);

        return sql;
    }

    buildDelete(query) {
        var sql = 'DELETE FROM ' + this.quoteName(query.query.table),
            wheres = query.query.where;

        sql += this._buildWhereClause(wheres);

        return sql;
    }
}

module.exports = MysqlBuilder;