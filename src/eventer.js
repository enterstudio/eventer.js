var Eventer = function() {

    if( !(this instanceof Eventer) ) {
        return new Eventer();
    }

    this.publish = function(topic, args){
        topics = _to_a(topic);

        topics.forEach(function(topic){

            if(typeof cache[topic] === 'object') {    

                cache[topic].forEach(function(property){
                    property.apply(this, args || []);
                });
            }
        });
    };

    this.subscribe = function(topic, callback){
        var callbacks = [].concat(callback);

        callbacks.forEach(function(callback){

            if(!cache[topic]){
                cache[topic] = [];
            }

            cache[topic].push(callback);
        });

        return [topic, callback]; 
    };

    this.unsubscribe = function(topic, fn){

        if( cache[topic] ) {

            cache[topic].forEach(function(element, idx){

                if(element == fn){
                    cache[topic].splice(idx, 1);
                }
            });
        }
    };

    this.queue = function() {
        return cache;
    };

    // alias
    this.on      = this.subscribe;
    this.off     = this.unsubscribe;
    this.trigger = this.publish;

    // private

    cache = {};

    var _to_a = function(o) {
        if( typeof o === 'string' ) {
            return o.split(' ');
        }
        return o;
    };

  return this;
};
module.exports.Eventer = Eventer;
