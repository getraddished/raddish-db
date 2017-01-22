'use strict';

var AbstractDelete = require('./../abstract/delete');

class MysqlDelete extends AbstractDelete {
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
        var query = 'DELETE FROM ' + this.quoteName(this.query.table),
            wheres = this.query.where;

        if(wheres.length) {
            query += ' WHERE';

            var last = (wheres.length - 1);
            for(var where of wheres) {
                query += ' (' + this.quoteName(where.column) + ' ' + this.getConstraint(where.type) + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(wheres.indexOf(where) < last) {
                    query += ' ' + where.next.toUpperCase();
                }
            }
        }

        return query;
    }
}

module.exports = MysqlDelete;