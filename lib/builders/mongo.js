'use strict';

var AbstractBuilder = require('./abstract'),
    ObjectID = require('mongodb').ObjectID;

class MongoBuilder extends AbstractBuilder {
    buildSelect(query) {
        // we will return a few things in an object.
        var result = {
            method: 'find',
            collection: query.from.table,
            query: {},
            limit: query.limit || 20,
            offset: query.limit
        };

        // Loop throught the wheres.
        for(var where of query.where) {
            where.column = where.column.replace(query.from.alias + '.', '');

            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
                case 'equals':
                    result.query[where.column] = where.value;
                    break;
                case 'in':
                    result.query[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                    break;
                case 'like':
                    result.query[where.column] = {$regex: where.value};
                    break;
            }
        }

        return result;
    }

    buildInsert(query) {
        // we will return a few things in an object.
        var result = {
            method: 'insert',
            collection: query.table,
            query: {}
        };

        // Loop throught the wheres.
        for(var set of query.set) {
            result.query[set.column] = set.value;
        }

        return result;
    }

    buildUpdate(query) {
        var result = {
            method: 'update',
            collection: query.table,
            filter: {},
            set: {}
        };

        // Loop throught the wheres.
        for(var set of query.set) {
            result.set[set.column] = set.value;
        }

        for(var where of query.where) {
            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
                case 'equals':
                    result.filter[where.column] = where.value;
                    break;
                case 'in':
                    result.filter[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                    break;
                case 'like':
                    result.filter[where.column] = {$regex: where.value};
                    break;
            }
        }

        return result;
    }

    buildDelete(query) {
        var result = {
            method: 'delete',
            collection: query.table,
            query: {}
        };

        for(var where of query.where) {
            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
                case 'equals':
                    result.query[where.column] = where.value;
                    break;
                case 'in':
                    result.query[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                    break;
                case 'like':
                    result.query[where.column] = {$regex: where.value};
                    break;
            }
        }

        return result;
    }
}

module.exports = MongoBuilder;