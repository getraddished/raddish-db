'use strict';

class AbstractQuery {
    quoteName(name) {
        if(name.indexOf('AS') > -1 || name.indexOf('.') > -1) {
            name = name.replace(/\b(\w+) AS (\w+)\b/g, '`$1` AS `$2`');
            name = name.replace(/\bAS (\w+)\b/g, 'AS `$1`');
            name =  name.replace(/\b(\w+)\.(\w+)\b/g, '`$1`.`$2`');

            return name.replace(/\b(\w+)\b\.\*/g, '`$1`.*');
        } else if(name !== '*') {
            return '`' + name + '`';
        } else {
            return name;
        }
    }

    escape(value) {
        if(Array.isArray(value)) {
            var escaped = value.map(function(value) {
                return this.escape(value);
            }.bind(this));

            return '(' + escaped.join(', ') + ')';
        } else if(typeof value !== 'string' && value !== null) {
            value = value.toString();
        } else if(value === null) {
            value = 'null';
        }

        return '\'' + value.replace(/[\/\\^$*+?.()|[\]{}'"]/g, '\\$&') + '\'';
    }

    /**
     * This is a convenience method for the toQuery method.
     *
     * @return {*}              The query to execute.
     */
    toString() {
        return this.toQuery();
    }

    /**
     * This method will return the query in query form for the selected database adapter.
     *
     * @return {*} The query to execute on the selected adapter.
     */
    toQuery() {
        throw new Error('This method must be overwritten per query builder!');
    }
}

module.exports = AbstractQuery;