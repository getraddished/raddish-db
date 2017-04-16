'use strict';

var RaddishDB = require('../index');

require('should');

describe('MongoDB tests', function() {
    describe('getInstance tests', function() {
        it('should return a correct instance', function() {
            var instance = RaddishDB.getInstance('mongo');

            instance.should.be.an.Object;
            instance.should.have.property('type', 'mongo');
        });

        it('Should return a query builder', function() {
            var builder = RaddishDB.getInstance('mongo').getBuilder();

            builder.should.be.an.Object;
            builder.constructor.name.should.be.exactly('MongoBuilder');
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
                    .where('_id').in(['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012', '507f1f77bcf86cd799439013']).limit(10).offset(5),
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

                built = RaddishDB.getInstance('mongo').getBuilder().build(query),
                built2 = RaddishDB.getInstance('mongo').getBuilder().build(query2),
                built3 = RaddishDB.getInstance('mongo').getBuilder().build(query3),
                built4 = RaddishDB.getInstance('mongo').getBuilder().build(query4),
                built5 = RaddishDB.getInstance('mongo').getBuilder().build(query5),
                built6 = RaddishDB.getInstance('mongo').getBuilder().build(query6);

            built.collection.should.equal('foo');
            JSON.stringify(built.query).should.equal('{"bar":"baz"}');

            built2.collection.should.equal('foo');
            JSON.stringify(built2.query).should.equal('{"bar":"baz"}');

            built3.collection.should.equal('foo');
            JSON.stringify(built3.query).should.equal('{"title":{"$regex":"%test%"}}');

            built4.collection.should.equal('foo');
            JSON.stringify(built4.query).should.equal('{"_id":{"$in":["507f1f77bcf86cd799439011","507f1f77bcf86cd799439012","507f1f77bcf86cd799439013"]}}');
            built4.limit.should.equal(10);

            built5.collection.should.equal('foo');
            JSON.stringify(built5.query).should.equal('{"_id":"507f1f77bcf86cd799439011"}');

            built6.collection.should.equal('foo');
            JSON.stringify(built6.query).should.equal('{"age":{"$gte":18,"$lte":22},"length":{"$gte":"170"},"experience":{"$lte":2}}');
        });

        it('Should return a valid update statement', function() {
            var query = RaddishDB.getQuery()
                    .update('accounts')
                    .set('username', 'jasper2')
                    .where('username')
                    .is('jasper'),

                built = RaddishDB.getInstance('mongo').getBuilder().build(query);

            built.method.should.equal('update');
            built.filter.should.be.an.Object;
            built.set.should.be.an.Object;
            built.collection.should.equal('accounts');
        });

        it('Should return a valid insert statement', function() {
            var query = RaddishDB.getQuery()
                    .insert()
                    .into('accounts')
                    .set('username', 'jasper2'),

                built = RaddishDB.getInstance('mongo').getBuilder().build(query);

            built.method.should.equal('insert');
            built.query.should.be.an.Object;
            built.collection.should.equal('accounts');
        });

        it('Should return a valid delete statement', function() {
            var query = RaddishDB.getQuery()
                .delete()
                .from('accounts')
                .where('username').is('jasper2'),

                built = RaddishDB.getInstance('mongo').getBuilder().build(query);

            built.method.should.equal('delete');
            built.query.should.be.an.Object;
            built.collection.should.equal('accounts');
        });
    });

    describe('Query execution', function() {
        it('Should return an array with column information', function() {
            return RaddishDB.getInstance('mongo')
                .getColumns('accounts')
                .then(function(result) {
                    result.should.be.an.Array;
                    result.length.should.be.a.Number;
                });
        });

        it('Should return a correct select result', function() {
            var query = RaddishDB.getQuery().select('*').from('accounts');

            return RaddishDB.getInstance('mongo').execute(query)
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

            return RaddishDB.getInstance('mongo').execute(query)
                .then(function(result) {
                    result.should.be.an.Object;

                    return RaddishDB.getInstance('mongo').getInsertedId(result);
                })
                .then(function(insertedId) {
                    insertedId.should.be.a.Number;
                });
        });

        it('Should return a correct delete result', function() {
            var query = RaddishDB.getQuery()
                .delete()
                .from('accounts')
                .where('username').is('jasper');

            return RaddishDB.getInstance('mongo').execute(query)
                .then(function(result) {
                    result.deletedCount.should.be.a.Number;
                });
        });
    });
});
