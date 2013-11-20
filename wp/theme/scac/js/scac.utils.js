var SCAC = SCAC || {};
SCAC.UTILS = SCAC.UTILS || {
	
	publish: function(name, o) {

        if(o && Object.prototype.toString.call(o) === '[object Array]') {
            // An array of parameters is passed with event
            console.log('Array passed');
            $(document).trigger(name, o);
        } else {
            // Either an Object is passed containing all params, or just a string passed with no extra params
            if(typeof name === 'object') {
                console.log('object passed');
                $(document).trigger(name);
            } else {
                console.log('string');
                $(document).trigger(name);
            }

        }

	},

    subscribe: function(name, callback) {
	    $(document).on(name, function(event, o) {
            callback(o);
        });
	}
		
};