function Builder(type) {
  this.type = type;
}

Builder.prototype.select = function(columns) {
    var Builder = require('./' + this.type + '/builder/select'),
        builder = new Builder();

    if(columns) {
        builder.select(columns);
    }

    return builder;
};

Builder.prototype.insert = function() {
    var Builder = require('./' + this.type + '/builder/insert'),
        builder = new Builder();

    return builder;
};

Builder.prototype.update = function(table) {
    var Builder = require('./' + this.type + '/builder/update'),
        builder = new Builder();

    if(table) {
        builder.table(table);
    }

    return builder;
};

Builder.prototype.delete = function() {
    var Builder = require('./' + this.type + '/builder/delete'),
        builder = new Builder();

    return builder;
};

module.exports = Builder;
