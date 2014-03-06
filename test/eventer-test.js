var assert = require('assert'),
    Eventer = require('../src/eventer.js').Eventer;

describe( 'Eventer', function(){
    var eventer = new Eventer(),
        a = function() { return 1; },
        b = function() { return 2; },
        c = function() { return 3; };

    it( 'forces instantiation', function(){
        var e = Eventer();
        assert.equal( true, e instanceof(Eventer) );
    });

    it( 'creates isolated instances', function(){
        var e = new Eventer(),
            f = new Eventer();
        e.subscribe('a', function(){});
        assert.notEqual( f.cache, e.cache );
    });

    describe('subscribe', function(){

        it( 'should subscribe to an event', function(){
            assert.equal( eventer.cache.subscribe, undefined );
            eventer.subscribe( 'subscribe', a );
            assert.equal( eventer.cache.subscribe.length, 1 );
            eventer.subscribe( 'subscribe', b );
            assert.equal( eventer.cache.subscribe.length, 2 );
        });

        it( 'can subscribe multiple functions to a single topic', function(){
            eventer.cache.subscribe = undefined ;
            eventer.subscribe( 'subscribe', [a, b] );
            assert.equal( eventer.cache.subscribe.length, 2 );
        });

        it( 'can subscribe multiple functions to multiple topics', function(){
            assert.equal( eventer.cache.manysubscribe1, undefined );
            assert.equal( eventer.cache.manysubscribe2, undefined );
            eventer.subscribe( ['manysubscribe1', 'manysubscribe2'], [a, b] );
            assert.equal( eventer.cache.manysubscribe1.length, 2 );
            assert.equal( eventer.cache.manysubscribe2.length, 2 );
            assert.equal( eventer.cache.manysubscribe1[0], a );
            assert.equal( eventer.cache.manysubscribe1[1], b );
            assert.equal( eventer.cache.manysubscribe2[0], a );
            assert.equal( eventer.cache.manysubscribe2[1], b );
        });
    });

    describe('unsubscribe', function(){

        it( 'should unsubscribe to an event', function(){
            assert.equal( eventer.cache.unsubscribe, undefined );
            eventer.subscribe( 'unsubscribe', a );
            eventer.subscribe( 'unsubscribe', b );
            eventer.subscribe( 'unsubscribe', c );
            eventer.unsubscribe( 'unsubscribe', a );
            assert.equal( eventer.cache.unsubscribe.length, 2 );
            assert.equal( eventer.cache.unsubscribe[0], b );
            assert.equal( eventer.cache.unsubscribe[1], c );
        });

        it( 'can unsubscribe a function from multiple events', function(){
            assert.equal( eventer.cache.munsubscribe1, undefined );
            assert.equal( eventer.cache.munsubscribe2, undefined );
            eventer.subscribe( ['munsubscribe1', 'munsubscribe2'], [a, b] );
            assert.equal( eventer.cache.munsubscribe1.length, 2 );
            assert.equal( eventer.cache.munsubscribe2.length, 2 );
            eventer.unsubscribe( 'munsubscribe1', [a, b] );
            assert.equal( eventer.cache.munsubscribe1.length, 0 );
            eventer.unsubscribe( 'munsubscribe2', [a, b] );
            assert.equal( eventer.cache.munsubscribe2.length, 0 );
        });

        it( 'can unsubscribe multiple functions from multiple events', function(){
            assert.equal( eventer.cache.mmunsubscribe1, undefined );
            assert.equal( eventer.cache.mmunsubscribe2, undefined );
            eventer.subscribe( ['mmunsubscribe1', 'mmunsubscribe2'], [a, b] );
            assert.equal( eventer.cache.mmunsubscribe1.length, 2 );
            assert.equal( eventer.cache.mmunsubscribe2.length, 2 );
            eventer.unsubscribe( ['mmunsubscribe1', 'mmunsubscribe2'], [a, b] );
            assert.equal( eventer.cache.mmunsubscribe1.length, 0 );
            assert.equal( eventer.cache.mmunsubscribe2.length, 0 );
        });

        it( 'can unsubscribe all functions from all events', function(){
            assert.equal( eventer.cache.aunsubscribe1, undefined );
            assert.equal( eventer.cache.aunsubscribe2, undefined );
            eventer.subscribe( ['aunsubscribe1', 'aunsubscribe2'], [a, b] );
            eventer.unsubscribe( ['aunsubscribe1', 'aunsubscribe2']);
            assert.equal( eventer.cache.aunsubscribe1, undefined );
            assert.equal( eventer.cache.aunsubscribe2, undefined );
        });
    });

    describe( 'publish', function(){

        var a = function(data) {
            assert.equal(1, data);
        };

        var b = function(data) {
            assert.equal(1, data);
        };

        it('publishes data to functions', function(){
            assert.equal( eventer.cache.publish, undefined );
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
            assert.equal( eventer.cache.added, undefined );
            eventer.subscribe( 'added', added_1 );
            eventer.subscribe( 'added', added_2 );
            eventer.subscribe( 'added', added_3 );
            eventer.publish( 'added', [] );
        });

        it('can publish data to multiple topics', function(){
            var state = 0,
                multi = function(d) {
                    state += d;
                };
            assert.equal( eventer.cache.multiple, undefined );
            eventer.subscribe( 'multi:1', multi );
            eventer.subscribe( 'multi:2', multi );
            eventer.publish( ['multi:1', 'multi:2'], [1] );
            assert.equal( 2, state );
        });
    });

    describe('aliases', function(){

        it('maps on to subscribe', function(){
            assert.equal(eventer.on, eventer.subscribe);
        });

        it('maps trigger to publish', function(){
            assert.equal(eventer.trigger, eventer.publish);
        });

        it('maps off to subscribe', function(){
            assert.equal(eventer.off, eventer.unsubscribe);
        });

        it('truly acts as an alias', function(){
            // I wasn't sure how this worked in JS
            assert.equal( eventer.cache.alias, undefined );
            eventer.on('alias', a);
            assert.equal( eventer.cache.alias.length, 1 );
        });

    });
});
