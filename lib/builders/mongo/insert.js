'use strict';

var AbstractInsert = require('./../abstract/insert');

class MongoInsert extends AbstractInsert {
    toQuery() {
        // we will return a few things in an object.
        var query = {
            method: 'insert',
            collection: this.query.table,
            query: {}
        };

        // Loop throught the wheres.
        for(var set of this.query.set) {
            query.query[set.column] = set.value;
        }

        return query;
    }
}

module.exports = MongoInsert;