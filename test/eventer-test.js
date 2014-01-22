var assert = require('assert'),
    Eventer = require('../src/eventer.js').Eventer;

describe( 'Eventer', function(){
    var eventer = new Eventer(),
        a = function() { return 1; },
        b = function() { return 2; },
        c = function() { return 3; };

    it( 'should subscribe to an event', function(){
        assert.equal( eventer.queue()['subscribe'], undefined );
        eventer.subscribe( 'subscribe', a );
        assert.equal( eventer.queue()['subscribe'].length, 1 );
        eventer.subscribe( 'subscribe', b );
        assert.equal( eventer.queue()['subscribe'].length, 2 );
    });

    it( 'should unsubscribe to an event', function(){
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

        var added_data = 0 ,
            added_1 = function() {
                added_data += 1;
                assert.equal( 1, added_data );
            },
            added_2 = function() {
                added_data += 2;
                assert.equal( 3, added_data );
            },
            added_3 = function() {
                added_data += 3;
                assert.equal( 6, added_data );
            };

        it('call functions in the order they were added', function(){
            assert.equal( eventer.queue()['added'], undefined );
            eventer.subscribe( 'added', added_1 );
            eventer.subscribe( 'added', added_2 );
            eventer.subscribe( 'added', added_3 );
            eventer.publish( 'added', [] );
        });
    });
})
