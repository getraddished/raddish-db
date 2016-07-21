var Abstract = require('./abstract'),
    util = require('util');

function AbstractInsert(table) {
    this.table = table;
}

util.inherits(AbstractInsert, Abstract);

modoule.exports = AbstractInsert;