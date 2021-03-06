'use strict';

var AbstractBuilder = require('./abstract');

/**
 * This class will hold all the build method specific for SQL queries.
 *
 * @class MysqlBuilder
 */
class MysqlBuilder extends AbstractBuilder {
    /**
     * This method will quote the names of the column.
     * Currently only used in SQL databases.
     *
     * @method quoteName
     * @param {String} name The column to quote.
     * @return (String) The quoted column.
     */
    quoteName(name) {
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
    }

    /**
     * This method will escape the values to be database safe.
     *
     * @method escape
     * @param {*} value The value to escape.
     * @return {String} The escaped value.
     */
    escape(value) {
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
    }

    /**
     * This method will return the constraint for the query.
     *
     * @method _getConstraint
     * @param {String} constraint the constraint to check up.
     * @return {String} The constraint to use in the query.
     * @private
     */
    _getConstraint(constraint, value) {
        switch(constraint) {
        case 'equals':
            constraint = '= ' + this.escape(value);
            break;
        case 'like':
            constraint = 'LIKE ' + this.escape(value);
            break;
        case 'in':
            constraint = 'IN (' + value + ')';
            break;
        case 'between':
            constraint = 'BETWEEN ' + this.escape(value.start) + ' AND ' + this.escape(value.end)
            break;
        case 'gt':
            constraint = '> ' + this.escape(value);
            break;
        case 'lt':
            constraint = '< ' + this.escape(value);
            break;
        }

        return constraint;
    }

    /**
     * This method will build a where clause based on a query.
     *
     * @method _buildWhereClause
     * @param {Array} wheres The where array to turn into a where statement.
     * @return {string} The SQL where statement.
     * @private
     */
    _buildWhereClause(wheres) {
        var sql = '';

        if(wheres.length) {
            sql += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                sql += ' (' + this.quoteName(where.column) + ' ' + this._getConstraint(where.type, where.value) + ')';

                if(wheres.indexOf(where) < last) {
                    sql += ' ' + where.next.toUpperCase();
                }
            }
        }

        return sql;
    }

    /**
     * This method will build a having clause based on a query.
     *
     * @method _buildHavingClause
     * @param {Array} havings The having array to turn into a having statement.
     * @return {string} The SQL having statement.
     * @private
     */
    _buildHavingClause(havings) {
        var sql = '';

        if(havings.length) {
            sql += ' HAVING';

            var last = (havings.length - 1);
            for(var having of havings) {
                sql += ' (' + this.quoteName(having.column) + ' ' + this._getConstraint(having.type, having.value) + ')';

                if(havings.indexOf(having) < last) {
                    sql += ' ' + having.next.toUpperCase();
                }
            }
        }

        return sql;
    }

    /**
     * This method will build the entire select statement for the database.
     *
     * @method buildSelect
     * @param {SelectQuery} query The query object to build.
     * @return {string} The SQL select query.
     */
    buildSelect(query) {
        var sql = 'SELECT ',
            columns = query.query.columns,
            cols = [],
            joins = query.query.join;

        if(!query.query.count.column) {
            for (var column of columns) {
                cols.push(this.quoteName(column.name) + (column.alias ? ' AS ' + this.quoteName(column.alias) : ''));
            }
        } else {
            var count = query.query.count;

            cols.push('COUNT(' + this.quoteName(count.column) + ')' + (count.alias ? ' AS ' + this.quoteName(count.alias) : ''));
        }
        sql += cols.join(', ') + ' FROM ' + this.quoteName(query.query.from.table + (query.query.from.alias ? ' AS ' + query.query.from.alias : ''));

        if(joins.length) {
            for(var join of joins) {
                sql += ' ' + join.type.toUpperCase() + ' JOIN ' + this.quoteName(join.table  + (join.alias ? ' AS ' + join.alias : '')) + ' ON (' + this.quoteName(join.set.source) + ' = ' + this.quoteName(join.set.target) + ')';
            }
        }

        sql += this._buildWhereClause(query.query.where);

        if(query.query.group.length) {
            sql += ' GROUP BY ' + query.query.group.join(',');
        }

        sql += this._buildHavingClause(query.query.having);

        if(query.query.sort.length) {
            sql += ' ORDER BY ' + query.query.sort.map(function(sort) {
                return this.quoteName(sort.column) + (sort.descending ? ' DESC' : '');
            }.bind(this)).join(', ');
        }

        if(query.query.limit) {
            sql += ' LIMIT ' + query.query.limit;

            if(query.query.offset) {
                sql += ',' + query.query.offset;
            }
        }

        return sql;
    }

    /**
     * This method will build the entire insert statement for the database.
     *
     * @method buildInsert
     * @param {InsertQuery} query The query object to build.
     * @return {string} The SQL insert query.
     */
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

    /**
     * This method will build the entire update statement for the database.
     *
     * @method buildUpdate
     * @param {UpdateQuery} query The query object to build.
     * @return {string} The SQL update query.
     */
    buildUpdate(query) {
        var sql = 'UPDATE ' + this.quoteName(query.query.table),
            sets = [];

        if(query.query.set.length) {
            sql += ' SET';

            for(var set of query.query.set) {
                sets.push(' ' + this.quoteName(set.column) + ' = ' + this.escape(set.value));
            }

            sql += sets.join(', ');
        }

        sql += this._buildWhereClause(query.query.where);
        sql += this._buildHavingClause(query.query.having);

        return sql;
    }

    /**
     * This method will build the entire delete statement for the database.
     *
     * @method buildDelete
     * @param {DeleteQuery} query The query object to build.
     * @return {string} The SQL delete query.
     */
    buildDelete(query) {
        var sql = 'DELETE FROM ' + this.quoteName(query.query.table),
            wheres = query.query.where;

        sql += this._buildWhereClause(wheres);

        return sql;
    }
}

module.exports = MysqlBuilder;