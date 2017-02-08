var RaddishDB = require('../index'),
    should = require('should');

describe('Basic module tests', function() {
    describe('These variables must be a method', function() {
        it('setConfig should be method', function() {
            RaddishDB.setConfig.should.be.a.function;
        });

        it('getInstance should be a method', function() {
            RaddishDB.getInstance.should.be.a.function;
        });

        it('getQueryBuilder should be a method', function() {
            RaddishDB.getQueryBuilder.should.be.a.function;
        });

        it('addCustomAdapter should be a method', function() {
            RaddishDB.addCustomAdapter.should.be.a.function;
        });
    });

    describe('Abstract objects must be defined', function() {
        it('AbstractAdapter should be a class', function() {
            RaddishDB.AbstractAdapter.should.be.a.class;
        });
    });
});