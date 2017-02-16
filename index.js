'use strict';

/**
 * The RaddishDB class is the main file that will be called
 * and will also hold all of the functionality.
 *
 * Next to that the AbstractAdapter is exported for extendibility.
 */
class RaddishDB {
    constructor() {
        this.config = {};
        this.instances = {};
        this.adapters = {};

        this.AbstractAdapter = require('./lib/adapters/abstract');
        this.AbstractBuilder = require('./lib/builders/abstract');
    }

    /**
     * This method sets all the config parameters of the Raddish-DB layer.
     * This is the initial method to be called before use.
     *
     * @param {Object}      config  The config object for the database layer.
     * @returns {RaddishDB}         The RaddishDB object for chaining.
     */
    setConfig(config) {
        this.config = config;

        return this;
    }

    /**
     * This method will return a database adapter or will throw an error when the database
     * adapter doesn't exist. This method will first check the existing adapter objects
     * when it doesn't find the object it will check in the custom adapters.
     *
     * @param {String} instance     The database instance to be used.
     * @returns {*}                 The required database adapter.
     */
    getInstance(instance) {
        if(!this.instances[instance]) {
            var config = this.config[instance];

            try {
                this.instances[instance] = new (require('./lib/adapters/' + config.type))(config);
            } catch (error) {
                if(!this.adapters[config.type]) {
                    console.log(error);
                    throw new TypeError('This adapter type (' + config.type + ') doesn\'t exist.');
                }

                this.instances[instance] = new (this.adapters[config.type])(config);
            }
        }

        return this.instances[instance];
    }

    getQueryBuilder() {
        return require('./lib/query/builder');
    }

    /**
     * This method adds the possibility to allow for custom adapters to be added.
     *
     * @param {String} type         The name of the adapter type.
     * @param {Object} adapter      The un initialized adapter object.
     * @returns {RaddishDB}         The RaddishDB object for chaining.
     */
    addCustomAdapter(type, adapter) {
        if(!this.adapters[type]) {
            this.adapters[type] = adapter;
        }

        return this;
    }
}

module.exports = new RaddishDB();
