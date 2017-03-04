'use strict';

var AbstractBuilder = require('./abstract'),
    ObjectID = require('mongodb').ObjectID;

/**
 * This is the main builder for the queries specific for MongoDB.
 * All the method to build the queries are specified here.
 *
 * @class MongoBuilder
 */
class MongoBuilder extends AbstractBuilder {
    /**
     * This method will build the where clause used for mongo.
     * When a column with the value "_id" is found this object will be parsed to an ObjectID to be used in MongoDB.
     *
     * Also the table alias is removed from the columns.
     *
     * @param {Object} query The query object
     * @param {Array} wheres The array containing the where statements.
     * @param {String} from The table to be selected.
     * @private
     */
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

    /**
     * This method will build the entire select statement for the database.
     *
     * @method buildSelect
     * @param {SelectQuery} query The query object to build.
     * @return {string} The MongoDB select object.
     */
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

    /**
     * This method will build the entire insert statement for the database.
     *
     * @method buildInsert
     * @param {InsertQuery} query The query object to build.
     * @return {string} The MongoDB insert object.
     */
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

    /**
     * This method will build the entire update statement for the database.
     *
     * @method buildUpdate
     * @param {UpdateQuery} query The query object to build.
     * @return {string} The MongoDB update object.
     */
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

    /**
     * This method will build the entire delete statement for the database.
     *
     * @method buildDelete
     * @param {DeleteQuery} query The query object to build.
     * @return {string} The MongoDB delete object.
     */
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