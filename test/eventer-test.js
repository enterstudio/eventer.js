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

    it( 'should unsubscribe to an event', function(){
        var a = function() { return 1; },
            b = function() { return 2; },
            c = function() { return 3; }
        assert.equal( eventer.queue()['unsubscribe'], undefined );
        eventer.subscribe( 'unsubscribe', a );
        eventer.subscribe( 'unsubscribe', b );
        eventer.subscribe( 'unsubscribe', c );
        eventer.unsubscribe( 'unsubscribe', a );
        assert.equal( eventer.queue()['unsubscribe'].length, 2 );
        assert.equal( eventer.queue()['unsubscribe'][0], b );
        assert.equal( eventer.queue()['unsubscribe'][1], c );
    });

    describe( 'publish', function(){

        var a = function(data) {
            assert.equal(1, data);
        };

        var b = function(data) {
            assert.equal(1, data);
        };

        it('publishes data to functions', function(){
            assert.equal( eventer.queue()['publish'], undefined );
            eventer.subscribe( 'publish', a );
            eventer.subscribe( 'publish', b );
            eventer.publish( 'publish', [ 1 ] );
        });
    });
})
