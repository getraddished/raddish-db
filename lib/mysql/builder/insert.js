var AbstractInsert = require('./../../abstract/builder/insert'),
    util = require('util');

function MysqlInsert() {
    AbstractInsert.call(this);
}

util.inherits(MysqlInsert, AbstractInsert);

module.exports = MysqlInsert;
