var AbstractUpdate = require('./../../abstract/builder/update'),
    util = require('util');

function MysqlUpdate() {
    AbstractUpdate.call(this);
}

util.inherits(MysqlUpdate, AbstractUpdate);

MysqlUpdate.prototype.toQuery = function() {
    var keys = [],
        values = [],
        query = 'UPDATE ' + this.quoteName(this.query.table);

    if(this.query.set.length) {
        query += ' SET';

        for(var index in this.query.set) {
            if(this.query.set.hasOwnProperty(index)) {
                var set = this.query.set[index];

                query += ' ' + this.quoteName(set.column) + ' = ' + this.escape(set.value);
            }
        }
    }

    if(this.query.where.length) {
        query += ' WHERE';

        var last = (this.query.where.length - 1);
        for(var index in this.query.where) {
            if(this.query.where.hasOwnProperty(index)) {
                var where = this.query.where[index];

                query += ' (' + this.quoteName(where.column) + ' ' + where.constraint + ' ' + (Array.isArray(where.value) ? ('(' + where.value + ')') : this.escape(where.value))  + ')';

                if(index < last) {
                    query += ' ' + where.next;
                }
            }
        }
    }

    return query;
};

module.exports = MysqlUpdate;