// version 0.0.6
var Eventer = function() {
    if( !(this instanceof Eventer) ) {
        return new Eventer();
    }
    this.cache = {};
};
Eventer.prototype = {
    helpers: {
        to_a: function(o) {
            if( typeof o === 'string' ) {
                return o.split(' ');
            }
            return [].concat(o);
        }
    },
    publish: function(topic, args){
        var self = this;
        topics = this.helpers.to_a(topic);
        topics.forEach(function(topic){
            if(typeof self.cache[topic] === 'object') {    
                self.cache[topic].forEach(function(property){
                    // is not an array
                    if( typeof property !== 'object') {
                        property = [property, this];
                    }
                    // is an object
                    if(! property.length ) {
                        property = [property.callback, property.context];
                    }
                    property[0].apply(property[1], args || []);
                });
            }
        });
    },
    subscribe: function(topic, callback){
        var callbacks = [].concat(callback),
            topics = this.helpers.to_a(topic),
            self = this;
        callbacks.forEach(function(callback){
            topics.forEach(function(topic){
                if(!self.cache[topic]){
                    self.cache[topic] = [];
                }
                self.cache[topic].push(callback);
            });
        });
        return [topic, callback]; 
    },
    unsubscribe: function(topic, fn){
        var self = this,
            topics = this.helpers.to_a(topic),
            callbacks = this.helpers.to_a(fn);
        topics.forEach(function(topic){
            if( self.cache[topic] ) {
                callbacks.forEach(function(callback){
                    self.cache[topic].forEach(function(element, idx){
                        if(typeof callback === 'undefined'){
                            return delete self.cache[topic];
                        }
                        if(element === callback){
                            self.cache[topic].splice(idx, 1);
                        }
                    });
                });
            }
        });
    }
};
// Alias methods
Eventer.prototype.on      = Eventer.prototype.subscribe;
Eventer.prototype.off     = Eventer.prototype.unsubscribe;
Eventer.prototype.trigger = Eventer.prototype.publish;