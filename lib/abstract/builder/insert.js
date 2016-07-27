function AbstractInsert() {
    this.query = {
        table: '',
        set: []
    }
}

AbstractInsert.prototype.into = function(table) {
    this.query.table = table;

    return this;
};

AbstractInsert.prototype.set = function(column, value) {
    this.query.set.push({
        column: column,
        value: value
    });

    return this;
};

AbstractInsert.prototype.toQuery = function() {
    return '';
};

module.exports = AbstractInsert;
