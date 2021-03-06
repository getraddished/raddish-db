'use strict';

var RaddishDB = require('../index');

require('should');

describe('SQLite tests', function() {
    describe('getInstance tests', function() {
        it('should return a correct instance', function() {
            var instance = RaddishDB.getInstance('sqlite');

            instance.should.be.an.Object;
            instance.should.have.property('type', 'mysql');
        });

        it('Should return a query builder', function() {
            var builder = RaddishDB.getInstance('sqlite').getBuilder();

            builder.should.be.an.Object;
            builder.constructor.name.should.be.exactly('MysqlBuilder');
        });
    });

    describe('QueryBuilder tests', function() {
        it('Should return a valid select statement.', function() {
            var query = RaddishDB.getQuery()
                .select('*')
                .from('foo')
                .where('bar').is('baz'),
                query2 = RaddishDB.getQuery()
                    .select({
                        'tbl.identity_column': 'id'
                    }).from('foo', 'tbl')
                    .where('bar').is('baz')
                    .join('inner', 'baz').on('baz.bar', 'tbl.id'),
                query3 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('title').like('%test%'),
                query4 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('id').in([1, 2, 3]).limit(10).offset(5),

                built = RaddishDB.getInstance('sqlite').getBuilder().build(query),
                built2 = RaddishDB.getInstance('sqlite').getBuilder().build(query2),
                built3 = RaddishDB.getInstance('sqlite').getBuilder().build(query3),
                built4 = RaddishDB.getInstance('sqlite').getBuilder().build(query4);

            built.should.equal('SELECT * FROM `foo` WHERE (`bar` = \'baz\')');
            built2.should.equal('SELECT `tbl`.`identity_column` AS `id` FROM `foo` AS `tbl` INNER JOIN `baz` ON (`baz`.`bar` = `tbl`.`id`) WHERE (`bar` = \'baz\')');
            built3.should.equal('SELECT * FROM `foo` WHERE (`title` LIKE \'%test%\')');
            built4.should.equal('SELECT * FROM `foo` WHERE (`id` IN (1,2,3)) LIMIT 10,5');
        });

        it('Should return a valid update statement', function() {
            var query = RaddishDB.getQuery()
                    .update('accounts')
                    .set('username', 'jasper2')
                    .where('username')
                    .is('jasper'),

                built = RaddishDB.getInstance('sqlite').getBuilder().build(query);

            built.should.equal('UPDATE `accounts` SET `username` = \'jasper2\' WHERE (`username` = \'jasper\')');
        });

        it('Should return a valid insert statement', function() {
            var query = RaddishDB.getQuery()
                    .insert()
                    .into('accounts')
                    .set('username', 'jasper2'),

                built = RaddishDB.getInstance('sqlite').getBuilder().build(query);

            built.should.equal('INSERT INTO `accounts` (`username`) VALUES (\'jasper2\')');
        });

        it('Should return a valid delete statement', function() {
            var query = RaddishDB.getQuery()
                .delete()
                .from('accounts')
                .where('username').is('jasper2'),

                built = RaddishDB.getInstance('sqlite').getBuilder().build(query);

            built.should.equal('DELETE FROM `accounts` WHERE (`username` = \'jasper2\')');
        })
    });

    describe('Query execution', function() {
        it('Should return an array with column information', function() {
            return RaddishDB.getInstance('sqlite')
                .getColumns('accounts')
                .then(function(result) {
                    result.should.be.an.Array;
                    result.length.should.be.a.Number;
                });
        });

        it('Should return a correct select result', function() {
            var query = RaddishDB.getQuery().select('*').from('accounts');

            return RaddishDB.getInstance('sqlite').execute(query)
                .then(function(result) {
                    result.should.be.an.Array;
                    result.length.should.be.a.Number;
                });
        });

        it('Should return a correct insert result', function() {
            var query = RaddishDB.getQuery()
                .insert()
                .into('accounts')
                .set('username', 'jasper');

            return RaddishDB.getInstance('sqlite').execute(query)
                .then(function(result) {
                    result.should.be.an.Object;

                    return RaddishDB.getInstance('sqlite').getInsertedId(result);
                })
                .then(function(insertedId) {
                    insertedId.should.be.a.Number;
                });
        });
    });
});
