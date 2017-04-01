'use strict';

var RaddishDB = require('../index');

require('should');

class CustomAdapter extends RaddishDB.AbstractAdapter {
    connect() {
        // NOOP
    }
}

describe('Custom Adapter tests', function() {
    it('Should register the custom adapter', function() {
        RaddishDB.addCustomAdapter('custom', CustomAdapter);

        // RaddishDB.adapters.should.containEql('custom');
        Object.keys(RaddishDB.adapters).should.containEql('custom');
    });

    it('Should return the custom adapter', function() {
        RaddishDB.getInstance('custom').should.be.instanceOf(CustomAdapter);
    });

    it('Should throw an error when a non-existing database is called', function() {
        try {
            RaddishDB.getInstance('non-existing');
        } catch(err) {
            err.message.should.equal('Non-existing database called.');
        }
    });

    it('Should throw an error when the database type isn\'t found', function() {
        try {
            RaddishDB.getInstance('missing');
        } catch(err) {
            err.message.should.equal('This adapter type (undefined) doesn\'t exist.');
        }
    });
});