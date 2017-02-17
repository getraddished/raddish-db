'use strict';

class QueryBuilder {
    getBuilder(type) {
        try {
            return new (require('./' + type));
        } catch(error) {
            throw new Error('Querybuilder ' + type + ' doesn\'t exist');
        }
    }

    select(columns) {
        var builder = this.getBuilder('select');

        if(columns) {
            builder.select(columns);
        }

        return builder;
    }

    insert() {
        return this.getBuilder('insert');
    }

    update(table) {
        var builder = this.getBuilder('update');

        if(table) {
            builder.table(table);
        }

        return builder;
    }

    delete() {
        return this.getBuilder('delete');
    }
}

module.exports = new QueryBuilder();
