'use strict';

var RaddishDB = require('../index');

require('should');

describe('MySQL tests', function() {
    describe('getInstance tests', function() {
        it('should return a correct instance', function() {
            var instance = RaddishDB.getInstance('mysql');

            instance.should.be.an.Object;
            instance.should.have.property('type', 'mysql');
        });

        it('Should return a query builder', function() {
            var builder = RaddishDB.getInstance('mysql').getBuilder();

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
                    .or().where('bar').is('foo')
                    .join('inner', 'baz').on('baz.bar', 'tbl.id'),
                query3 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('title').like('%test%'),
                query4 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('id').in([1, 2, 3])
                    .and().where('name').is('Jasper').limit(10).offset(5),
                query5 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('_id').is('507f1f77bcf86cd799439011'),
                query6 = RaddishDB.getQuery()
                    .select('*')
                    .from('foo')
                    .where('age').between(18, 22)
                    .where('length').gt('170')
                    .where('experience').lt(2),

                built = RaddishDB.getInstance('mysql').getBuilder().build(query),
                built2 = RaddishDB.getInstance('mysql').getBuilder().build(query2),
                built3 = RaddishDB.getInstance('mysql').getBuilder().build(query3),
                built4 = RaddishDB.getInstance('mysql').getBuilder().build(query4),
                built5 = RaddishDB.getInstance('mysql').getBuilder().build(query5),
                built6 = RaddishDB.getInstance('mysql').getBuilder().build(query6);

            built.should.equal('SELECT * FROM `foo` WHERE (`bar` = \'baz\')');
            built2.should.equal('SELECT `tbl`.`identity_column` AS `id` FROM `foo` AS `tbl` INNER JOIN `baz` ON (`baz`.`bar` = `tbl`.`id`) WHERE (`bar` = \'baz\') OR (`bar` = \'foo\')');
            built3.should.equal('SELECT * FROM `foo` WHERE (`title` LIKE \'%test%\')');
            built4.should.equal('SELECT * FROM `foo` WHERE (`id` IN (1,2,3)) AND (`name` = \'Jasper\') LIMIT 10,5');
            built5.should.equal('SELECT * FROM `foo` WHERE (`_id` = \'507f1f77bcf86cd799439011\')');
            built6.should.equal('SELECT * FROM `foo` WHERE (`age` BETWEEN \'18\' AND \'22\') AND (`length` > \'170\') AND (`experience` < \'2\')');
        });

        it('Should return a valid update statement', function() {
            var query = RaddishDB.getQuery()
                    .update('accounts')
                    .set('username', 'jasper2')
                    .where('username')
                    .is('jasper'),

                built = RaddishDB.getInstance('mysql').getBuilder().build(query);

            built.should.equal('UPDATE `accounts` SET `username` = \'jasper2\' WHERE (`username` = \'jasper\')');
        });

        it('Should return a valid insert statement', function() {
            var query = RaddishDB.getQuery()
                    .insert()
                    .into('accounts')
                    .set('username', 'jasper2'),

                built = RaddishDB.getInstance('mysql').getBuilder().build(query);

            built.should.equal('INSERT INTO `accounts` (`username`) VALUES (\'jasper2\')');
        });

        it('Should return a valid delete statement', function() {
            var query = RaddishDB.getQuery()
                .delete()
                .from('accounts')
                .where('username').is('jasper2'),

                built = RaddishDB.getInstance('mysql').getBuilder().build(query);

            built.should.equal('DELETE FROM `accounts` WHERE (`username` = \'jasper2\')');
        })
    });

    describe('Query execution', function() {
        it('Should return an array with column information', function() {
            return RaddishDB.getInstance('mysql')
                .getColumns('accounts')
                .then(function(result) {
                    result.should.be.an.Array;
                    result.length.should.be.a.Number;
                })
                .catch(function(err) {
                    console.log(err);
                });
        });

        it('Should return a correct select result', function() {
            var query = RaddishDB.getQuery().select('*').from('accounts');

            return RaddishDB.getInstance('mysql').execute(query)
                .then(function(result) {
                    result.should.be.an.Array;
                    result.length.should.be.a.Number;
                })
                .catch(function(err) {
                    console.log(err);
            });
        });

        it('Should return a correct insert result', function() {
            var query = RaddishDB.getQuery().insert().into('accounts').set('username', 'jasper');

            return RaddishDB.getInstance('mysql').execute(query)
                .then(function(result) {
                    result.should.be.an.Object;
                    result.should.have.property('insertId');

                    return RaddishDB.getInstance('mysql').getInsertedId(result);
                })
                .then(function(insertedId) {
                    insertedId.should.be.a.Number;
                });
        });
    });
});
