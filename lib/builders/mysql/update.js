'use strict';

var AbstractUpdate = require('./../abstract/update');

class MysqlUpdate extends AbstractUpdate {
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
        var keys = [],
            values = [],
            query = 'UPDATE ' + this.quoteName(this.query.table),
            wheres = this.query.where;

        if(this.query.set.length) {
            query += ' SET';

            for(var index in this.query.set) {
                if(this.query.set.hasOwnProperty(index)) {
                    var set = this.query.set[index];

                    query += ' ' + this.quoteName(set.column) + ' = ' + this.escape(set.value);
                }
            }
        }

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

module.exports = MysqlUpdate;