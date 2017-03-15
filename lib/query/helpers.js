'use strict';

class AbstractHelper {
    constructor(query) {
        this.query = query;
    }
}

class Where extends AbstractHelper {
    constructor(query, column) {
        super(query);

        this.column = column;
        this.value = null;
        this.type = null;
        this.next = 'and';
    }

    is(value) {
        this.value = value;
        this.type = 'equals';

        return this.query;
    }

    like(value) {
        this.value = value;
        this.type = 'like';

        return this.query;
    }

    in(value) {
        this.value = value;
        this.type = 'in';

        return this.query;
    }

    between(start, end) {
        this.value = {
            start: start,
            end: end
        };
        this.type = 'between';

        return this.query;
    }

    gt(value) {
        this.value = value;
        this.type = 'gt';

        return this.query;
    }

    lt(value) {
        this.type = value;
        this.type = 'lt';

        return this.query;
    }
}

class Join extends AbstractHelper {
    constructor(query, type, table, alias) {
        super(query);

        this.type = type;
        this.alias = alias || '';
        this.table = table;
        this.set = {
            source: '',
            target: ''
        };
    }

    on(source, target) {
        this.set.source = source;
        this.set.target = target;

        return this.query;
    }
}

module.exports = {
    Where: Where,
    Join: Join
};