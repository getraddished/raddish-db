'use strict';

var AbstractUpdate = require('./../abstract/update'),
    ObjectID = require('mongodb').ObjectID;

class MongoUpdate extends AbstractUpdate {
    toQuery() {
        // we will return a few things in an object.
        var query = {
            method: 'update',
            collection: this.query.table,
            filter: {},
            set: {}
        };

        // Loop throught the wheres.
        for(var set of this.query.set) {
            query.set[set.column] = set.value;
        }

        for(var where of this.query.where) {
            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
                case 'equals':
                    query.filter[where.column] = where.value;
                    break;
                case 'in':
                    query.filter[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                    break;
                case 'like':
                    query.filter[where.column] = {$regex: where.value};
                    break;
            }
        }

        return query;
    }
}

module.exports = MongoUpdate;