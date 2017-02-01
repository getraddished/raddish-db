'use strict';

var AbstractSelect = require('./../abstract/select'),
    ObjectID = require('mongodb').ObjectID;

class MongoSelect extends AbstractSelect {
    toQuery() {
        // we will return a few things in an object.
        var query = {
            method: 'find',
            collection: this.query.from.table,
            query: {},
            limit: this.query.limit || 20,
            offset: this.query.limit
        };

        // Loop throught the wheres.
        for(var where of this.query.where) {
            where.column = where.column.replace(this.query.from.alias + '.', '');

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

module.exports = MongoSelect;