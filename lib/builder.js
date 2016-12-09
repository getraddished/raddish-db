'use strict';

class Builder {
    constructor(type) {
        this.type =  type;
    }

    select(columns) {
        var Builder = require('./builders/' + this.type + '/select'),
            builder = new Builder();

        if(columns) {
            builder.select(columns);
        }

        return builder;
    }

    insert() {
        var Builder = require('./builders/' + this.type + '/insert'),
            builder = new Builder();

        return builder;
    }

    update(table) {
        var Builder = require('./builders/' + this.type + '/update'),
            builder = new Builder();

        if(table) {
            builder.table(table);
        }

        return builder;
    }

    delete() {
        var Builder = require('./builders/' + this.type + '/delete'),
            builder = new Builder();

        return builder;
    }
}

module.exports = Builder;
