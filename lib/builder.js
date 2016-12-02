'use strict';

class Builder {
    constructor(type) {
        this.type =  type;
    }

    select(columns) {
        var Builder = require('./' + this.type + '/builder/select'),
            builder = new Builder();

        if(columns) {
            builder.select(columns);
        }

        return builder;
    }

    insert() {
        var Builder = require('./' + this.type + '/builder/insert'),
            builder = new Builder();

        return builder;
    }

    update(table) {
        var Builder = require('./' + this.type + '/builder/update'),
            builder = new Builder();

        if(table) {
            builder.table(table);
        }

        return builder;
    }

    delete() {
        var Builder = require('./' + this.type + '/builder/delete'),
            builder = new Builder();

        return builder;
    }
}

module.exports = Builder;
