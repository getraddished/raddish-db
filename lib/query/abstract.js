'use strict';

var Helper = require('./helpers'),
    Wherable = function(parent) {
        return class extends parent {
            /**
             * The where function will add a filter to the query.
             *
             * @method where
             * @param  {String}     column      The column to filter on.
             * @return {*}                      The current object for chaining.
             */
            where(column) {
                this.last = 'where';

                var where = new Helper.Where(this, column);
                this.query.where.push(where);

                return where;
            }

            /**
             * The having function will add a filter to the query.
             *
             * @method having
             * @param  {String}     column      The column to filter on.
             * @return {*}                      The current object for chaining.
             */
            having(column) {
                this.last = 'having';

                var having = new Helper.Where(this, column);
                this.query.having.push(having);

                return having;
            }


            /**
             * This method gives the previous called where query a and statement.
             * If no where statements exist, then we give an error.
             *
             * @method and
             * @return {Object} The current builder.
             */
            and() {
                // Get the last where query.
                if(this.query[this.last].length === 0) {
                    throw new Error('No ' + this.last + ' clauses found!');
                }

                var item = this.query[this.last][this.query[this.last].length - 1];
                item.next = 'and';

                return this;
            }

            /**
             * This method gives the previous called where query a or statement.
             * If no where statements exist, then we give an error.
             *
             * @method or
             * @return {Object} The current builder.
             */
            or() {
                if(this.query[this.last].length === 0) {
                    throw new Error('No ' + this.last + ' clauses found!');
                }

                var item = this.query[this.last][this.query[this.last].length - 1];
                item.next = 'or';

                return this;
            }

            /**
             * This method will add a group statement.
             *
             * @method group
             * @param {String} column The column to group on.
             * @return {Object} The current builder.
             */
            group(column, direction) {
                this.query.group.push(column);
                
                return this;
            }
        };
    },
    Setable = function(parent) {
        return class extends parent {
            /**
             * This method will set a column and a value.
             *
             * @method set
             * @param {String}  column  The column name.
             * @param {*}       value   The value of the column.
             */
            set(column, value) {
                this.query.set.push({
                    column: column,
                    value: value
                });

                return this;
            }
        };
    };

module.exports = {
    Wherable: Wherable,
    Setable: Setable,

    /**
     * Mixin method to allow extending of mixed objects.
     *
     * @method mixin
     * @return {Object} The completely miced object.
     */
    mixin: function() {
        var mixins = Array.prototype.splice.call(arguments, 0);

        return mixins.reduce(function(base, mixin) {
            return mixin(base);
        }, class {});
    }
};