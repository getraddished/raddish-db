'use strict';

var AbstractDelete = require('./../abstract/delete'),
    ObjectID = require('mongodb').ObjectID;

class MongoDelete extends AbstractDelete {
    toQuery() {
        // we will return a few things in an object.
        var query = {
            method: 'delete',
            collection: this.query.table,
            query: {}
        };

        for(var where of this.query.where) {
            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
                case 'equals':
                    query.query[where.column] = where.value;
                    break;
                case 'in':
                    query.query[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                    break;
                case 'like':
                    query.query[where.column] = {$regex: where.value};
                    break;
            }
        }

        return query;
    }
}

module.exports = MongoDelete;