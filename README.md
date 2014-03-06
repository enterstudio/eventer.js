# Eventer.js

Eventer.js is a simple, lightweight client side pub sub object. Eventer contains all the usual suspects, `subscribe`, `publish`, and `unsubscribe` as well as their jQuery alisases `on`, `trigger`, and `off`.

`subscribe`, `publish`, and `unsubscribe` events in a one to one, one to many, or many to many fashion.

### One to one

Subscribe a single function to a single event, publish a single event, or delete a single function from an event.

```javascript
e.subscribe( 'hear:bark', this.stop );
e.publish( 'hear:bark' );
e.unsubscribe( 'hear:bark' );
```

### Many to one

Subscribe a single function to a set of events, publish many events, or delete a single function from a set of events.

```javascript
e.subscribe( ['hear:bark', 'hear:car'] , this.stop );
e.publish( ['hear:car', 'hear:bark'], [{some: data}] );
e.unsubscribe( ['hear:bark', 'hear:car'] , this.stop );
```

### Many to many

Subscribe many functions to many events, publish many events at once, or delete a collection of function from a set of events.

```javascript
e.subscribe( ['hear:bark', 'hear:car'] , [this.stop, this.listen, this.bark] );
e.publish( ['hear:car', 'hear:bark'], [{some: data}] );
e.unsubscribe( ['hear:bark', 'hear:car'] , [this.stop, this.listen] );
```


## Example

Here is a fun example of eventer on a `Dog` object. Eventer allows you to stich the functionality of your object. Paste the following code into a REPL. Don't forget to include Eventer :)


```javascript
var log = function() {
    console.log(' -> ' + Array.prototype.slice.call(arguments).join(''));
};

var Dog = function() {
    
    this.e = new Eventer();
    
    this.init = function() {

        // One function subscribed to an event
        this.e.subscribe( 'see:car', this.chase );
        this.e.subscribe( 'see:cat', this.chase );
        this.e.subscribe( 'sleep', this.find_cozy_place );

        // multiple functions subscribed to one event
        this.e.subscribe( 'hear:bark', [this.stop, this.listen, this.bark] );
        this.e.subscribe( 'eat', [this.eat, this.tired] );
        
        // One function subscribed to multiple events
        this.e.subscribe( ['see:stranger', 'see:mailman'], this.bark );
        
        // Multiple functions subscribed to multiple events
        this.e.subscribe( ['eat', 'sleep'], [this.relax, this.lay] );
    };
    
    this.destroy = function() {
        // unsubscribe a single function from an event
        this.e.unsubscribe( 'hear:bark', this.stop );

        // unsubscribe a multiple functions from multiple events
        this.e.unsubscribe( ['eat', 'sleep'], [this.relax, this.lay] );

        // delete an event
        this.e.unsubscribe( 'see:car' );
    };
    
    this.init.apply(this, arguments);
};

Dog.prototype.hear = function(what) {
    var event = 'hear:' + what;
    console.log(event);
    this.e.publish( event, [{thing: what}] );
};

Dog.prototype.see = function(who) {
    var event = 'see:' + who;
    console.log(event);
    this.e.publish( event, [{thing: who}] );
};

Dog.prototype.action = function(action) {
    console.log(action);
    this.e.publish( action );
};

Dog.prototype.eat = function(data) {
    log( "Mmmmm food! Yummy, that's good!" );
};

Dog.prototype.find_cozy_place = function(data) {
    log( "Better look for a cozy place" );
};

Dog.prototype.chase = function(data) {
    log( "I'm chasing a " + data.thing + "!" );
};

Dog.prototype.stop = function(data) {
    log( "STOP!" );
};

Dog.prototype.tired = function(data) {
    log( "Yaaaawwn. I'm sleepy." );
};

Dog.prototype.listen = function(data) {
    log( "... What was that?" );
};

Dog.prototype.bark = function(data) {
    log( "yap yap yap!" );
};

Dog.prototype.relax = function(data) {
    log( "Nice place, mind if I strech out?" );
};

Dog.prototype.lay = function(data) {
    log( "Laying down." );
};


d = new Dog();

d.hear('bark');
d.see('car');
d.see('cat');
d.see('stranger');
d.see('mailman');
d.action('eat');
d.action('sleep');

/*
// Output from the console.
////////////////////////////////

    hear:bark
      -> STOP!
      -> ... What was that?
      -> yap yap yap!
    see:car
      -> I'm chasing a car!
    see:cat
      -> I'm chasing a cat!
    see:stranger
      -> yap yap yap!
    see:mailman
      -> yap yap yap!
    eat
      -> Mmmmm food! Yummy, that's good!
      -> Yaaaawwn. I'm sleepy.
      -> Nice place, mind if I strech out?
      -> Laying down.
    sleep
      -> Better look for a cozy place
      -> Nice place, mind if I strech out?
      -> Laying down.

////////////////////////////////
*/
```
    
## Contributing

If you like Eventer please make it better! 

1. Use `grunt` for building and testing. 
2. Write specs for any new features.
