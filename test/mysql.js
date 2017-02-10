var RaddishDB = require('../index');

require('should');

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
                .where('bar').is('baz'),
                query2 = RaddishDB.getQueryBuilder()
                    .select({
                        'tbl.identity_column': 'id'
                    }).from('foo', 'tbl')
                    .where('bar').is('baz')
                    .join('inner', 'baz').on('baz.bar', 'tbl.id'),
                query3 = RaddishDB.getQueryBuilder()
                    .select('*')
                    .from('foo')
                    .where('title').like('%test%'),
                query4 = RaddishDB.getQueryBuilder()
                    .select('*')
                    .from('foo')
                    .where('id').in([1, 2, 3]),

                built = RaddishDB.getInstance('default').getBuilder().build(query),
                built2 = RaddishDB.getInstance('default').getBuilder().build(query2),
                built3 = RaddishDB.getInstance('default').getBuilder().build(query3),
                built4 = RaddishDB.getInstance('default').getBuilder().build(query4);

            built.should.equal('SELECT * FROM `foo` WHERE (`bar` = \'baz\')');
            built2.should.equal('SELECT `tbl`.`identity_column` AS `id` FROM `foo` AS `tbl` INNER JOIN `baz` ON (`baz`.`bar` = `tbl`.`id`) WHERE (`bar` = \'baz\')');
            built3.should.equal('SELECT * FROM `foo` WHERE (`title` LIKE \'%test%\')');
            built4.should.equal('SELECT * FROM `foo` WHERE (`id` IN (1,2,3))');
        });
    });

    describe('Query tests', function() {
        it('Should return a correct select result.', function() {

        });
    });
});
