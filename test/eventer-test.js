var assert = require('assert'),
    Eventer = require('../src/eventer.js').Eventer;

describe( 'Eventer', function(){
    var eventer = new Eventer(),
        mock;

    it( 'should subscribe to an event', function(){
        assert.equal( eventer.queue()['subscribe'], undefined );
        eventer.subscribe( 'subscribe', function(){ return 1 } );
        assert.equal( eventer.queue()['subscribe'].length, 1 );
        eventer.subscribe( 'subscribe', function(){ return 2 } );
        assert.equal( eventer.queue()['subscribe'].length, 2 );
    });
})
