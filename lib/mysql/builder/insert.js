var AbstractInsert = require('./../../abstract/builder/insert'),
    util = require('util');

function MysqlInsert() {
    AbstractInsert.call(this);
}

util.inherits(MysqlInsert, AbstractInsert);

MysqlInsert.prototype.toQuery = function() {
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
};

module.exports = MysqlInsert;
