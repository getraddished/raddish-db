'use strict';

var AbstractInsert = require('./../abstract/insert');

class MysqlInsert extends AbstractInsert {
    toQuery() {
        var keys = [],
            values = [],
            query = 'INSERT INTO ' + this.quoteName(this.query.table);

        for(var index in this.query.set) {
            if(this.query.set.hasOwnProperty(index)) {
                var set = this.query.set[index];

                keys.push(set.column);
                values.push(set.value);
            }
        }

        if(keys.length && values.length) {
            query += ' (' + keys.map(this.quoteName).join(',') + ') VALUES (' + values.map(this.escape).join(',') + ')';
        }

        return query;
    }
}

module.exports = MysqlInsert;
