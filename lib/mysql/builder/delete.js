var AbstractDelete = require('./../../abstract/builder/delete'),
    util = require('util');

function MysqlDelete() {
    AbstractDelete.call(this);
}

util.inherits(MysqlDelete, AbstractDelete);

MysqlDelete.prototype.toQuery = function() {
    var query = 'DELETE FROM ' + this.quoteName(this.query.table);

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

module.exports = MysqlDelete;