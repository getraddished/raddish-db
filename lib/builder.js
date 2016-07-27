function Builder(type) {
  this.type = type;
}

Builder.prototype.select = function(columns) {
    var Builder = require('./' + this.type + '/builder/select'),
        builder = new Builder();

    builder.select(columns);

    return builder;
};

Builder.prototype.insert = function() {
    var Builder = require('./' + this.type + '/builder/insert'),
        builder = new Builder();

    return builder;
};

module.exports = Builder;
