'use strict';


class Query {
    /**
     * This method will try to load and return the requested query object.
     *
     * @method getBuilder
     * @param {String} type The query type to get.
     * @return {*} The requested query builder.
     */
    getBuilder(type) {
        try {
            return new (require('./' + type));
        } catch(error) {
            throw new Error('Querybuilder ' + type + ' doesn\'t exist');
        }
    }

    /**
     * This method will return the select query.
     * When columns are given they are directly used to select these columns.
     *
     * @method select
     * @param {Object/ Array} columns The columns to select.
     * @return {SelectQuery} The select query object.
     */
    select(columns) {
        var builder = this.getBuilder('select');

        if(columns) {
            builder.select(columns);
        }

        return builder;
    }

    /**
     * This method will return the insert query.
     *
     * @method insert
     * @return {InsertQuery} The insert query object.
     */
    insert() {
        return this.getBuilder('insert');
    }

    /**
     * This method will return the insert query.
     * This method accepts one parameter, if set it will be used to set the table directly.
     *
     * @method update
     * @param {String} table The table to use.
     * @return {UpdateQuery} The update query object.
     */
    update(table) {
        var builder = this.getBuilder('update');

        if(table) {
            builder.table(table);
        }

        return builder;
    }

    /**
     * This method will return the delete query.
     *
     * @method delete
     * @return {DeleteQuery} The delete query object.
     */
    delete() {
        return this.getBuilder('delete');
    }
}

module.exports = new Query();
