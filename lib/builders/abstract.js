'use strict';

class AbstractBuilder {
    buildSelect() {
        throw new Error('This method must be overridden!');
    }

    buildInsert() {
        throw new Error('This method must be overridden!');
    }

    buildUpdate() {
        throw new Error('This method must be overridden!');
    }

    buildDelete() {
        throw new Error('This method must be overridden!');
    }

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

    build(query) {
        var method = 'build' + (query.type.charAt(0).toUpperCase() + query.type.slice(1));

        return this[method](query);
    }
}

module.exports = AbstractBuilder;