var AbstractAdapter = require('./../abstract/adapter'),
    util = require('util');

Function MongoAdapter(config) {
    AbstractAdapter.call(this, config);

    this.type = 'mongo';
}

util.inherits(MongoAdapter, AbstractAdapter)

module.exports = MongoAdapter;
