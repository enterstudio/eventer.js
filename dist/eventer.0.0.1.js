var Eventer = function() {

    if( !(this instanceof Eventer) ) {
        return new Eventer();
    }

    var cache = {};

    this.publish = function(topic, args){
        if(typeof cache[topic] === 'object') {    
            cache[topic].forEach(function(property){
                property.apply(this, args || []);
            });
        }
    };

    this.subscribe = function(topic, callback){
        if(!cache[topic]){
            cache[topic] = [];
        }
        cache[topic].push(callback);
        return [topic, callback]; 
    };

    this.unsubscribe = function(handle){
        var t = handle[0];
        cache[t] && $.each(cache[t], function(idx){
            if(this == handle[1]){
                cache[t].splice(idx, 1);
            }
        });
    };

  return this;
};

