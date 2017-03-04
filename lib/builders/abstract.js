'use strict';

class AbstractBuilder {
    /**
     * This is the main method to be called to build a query.
     * This method will check with build method is suited for the query to build it.
     *
     * @method build
     * @param {*} query A query to build
     * @return {*} The build query ready to be handed to the adapter.
     */
    build(query) {
        var method = 'build' + (query.type.charAt(0).toUpperCase() + query.type.slice(1));

        return this[method](query);
    }

    /**
     * This is an abstract method to build the select query.
     * This method needs to be overridden per adapter.
     */
    buildSelect() {
        throw new Error('This method must be overridden!');
    }

    /**
     * This is an abstract method to build the insert query.
     * This method needs to be overridden per adapter.
     */
    buildInsert() {
        throw new Error('This method must be overridden!');
    }

    /**
     * This is an abstract method to build the upate query.
     * This method needs to be overridden per adapter.
     */
    buildUpdate() {
        throw new Error('This method must be overridden!');
    }

    /**
     * This is an abstract method to build the delete query.
     * This method needs to be overridden per adapter.
     */
    buildDelete() {
        throw new Error('This method must be overridden!');
    }
}

module.exports = AbstractBuilder;