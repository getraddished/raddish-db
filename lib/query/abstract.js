'use strict';

var Helper = require('./helpers'),
    Wherable = function(parent) {
        return class extends parent {
            /**
             * The where function will add a filter to the query.
             *
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
             * @return {AbstractUpdate}
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
             * @return {AbstractUpdate}
             */
            or() {
                if(this.query[this.last].length === 0) {
                    throw new Error('No ' + this.last + ' clauses found!');
                }

                var item = this.query[this.last][this.query[this.last].length - 1];
                item.next = 'or';

                return this;
            }
        };
    },
    Setable = function(parent) {
        return class extends parent {
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
    mixin: function() {
        var mixins = Array.prototype.splice.call(arguments, 0);

        return mixins.reduce(function(base, mixin) {
            return mixin(base);
        }, class {});
    }
};