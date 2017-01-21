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
            builder.constructor.name.should.be.exactly('Builder');
        });

        it('Should return the correct query builder', function() {
            var builder = RaddishDB.getInstance('default').getBuilder();

            builder.select().constructor.name.should.be.exactly('MysqlSelect');
            builder.insert().constructor.name.should.be.exactly('MysqlInsert');
        });
    });
});
