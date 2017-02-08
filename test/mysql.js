var RaddishDB = require('../index'),
    should = require('should');

RaddishDB.setConfig({
    default: {
        host: 'localhost',
        type: 'mysql',
        username: 'root',
        password: 'root',
        database: 'devel_nfsw'
    }
});

describe('Basic tests', function() {
    describe('getInstance tests', function() {
        it('should return a correct instance', function() {
            var instance = RaddishDB.getInstance('default');

            instance.should.be.an.Object;
            instance.should.have.property('type', 'mysql');
        });

        it('Should return a query builder', function() {
            var builder = RaddishDB.getInstance('default').getBuilder();

            builder.should.be.an.Object;
            builder.constructor.name.should.be.exactly('MysqlBuilder');
        });
    });

    describe('QueryBuilder tests', function() {
        it('Should return a valid select statement.', function() {
            var query = RaddishDB.getQueryBuilder()
                .select('*')
                .from('foo')
                .where('bar').is('baz');

            var built = RaddishDB.getInstance('default').getBuilder().build(query);

            built.should.equal('SELECT * FROM `foo` WHERE (`bar` = \'baz\')');
        });
    });

    describe('Query tests', function() {
        it('Should return a correct select result.', function() {

        });
    });
});
