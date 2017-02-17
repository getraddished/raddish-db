'use strict';

var AbstractBuilder = require('./abstract'),
    ObjectID = require('mongodb').ObjectID;

class MongoBuilder extends AbstractBuilder {
    _buildQwhereClause(query, wheres, from) {
        for(var where of wheres) {
            if(from && from.alias) {
                where.column = where.column.replace(from.alias + '.', '');
            }

            if(where.column === '_id') {
                where.value = new ObjectID(where.value);
            }

            switch(where.type) {
            case 'equals':
                query[where.column] = where.value;
                break;
            case 'in':
                query[where.column] = {$in: (Array.isArray(where.value) ? where.value : [where.value])};
                break;
            case 'like':
                query[where.column] = {$regex: where.value};
                break;
            }
        }
    }

    buildSelect(query) {
        // we will return a few things in an object.
        var result = {
            method: 'find',
            collection: query.query.from.table,
            query: {},
            limit: query.query.limit || 20,
            offset: query.query.offset
        };

        // Loop throught the wheres.
        this._buildQwhereClause(result.query, query.query.where, query.query.from);

        return result;
    }

    buildInsert(query) {
        // we will return a few things in an object.
        var result = {
            method: 'insert',
            collection: query.query.table,
            query: {}
        };

        // Loop throught the wheres.
        for(var set of query.query.set) {
            result.query[set.column] = set.value;
        }

        return result;
    }

    buildUpdate(query) {
        var result = {
            method: 'update',
            collection: query.query.table,
            filter: {},
            set: {}
        };

        // Loop throught the wheres.
        for(var set of query.query.set) {
            result.set[set.column] = set.value;
        }

        this._buildQwhereClause(result.filter, query.query.where, false);

        return result;
    }

    buildDelete(query) {
        var result = {
            method: 'delete',
            collection: query.query.table,
            query: {}
        };

        this._buildQwhereClause(result.query, query.query.where, false);

        return result;
    }
}

module.exports = MongoBuilder;