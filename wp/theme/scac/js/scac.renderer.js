/**
 *	@class
 *   @constructor constructor for objects that loads .json, fetch template, render content and appned to the dom.
 *	@param {Object} config : contains all the config params to create new object.
 *	@param {String} config.templateName : Name of Handlebars template
 *	@param {String} config.templateURL : URL of the Handlebars template. Base directory is 'templates/'.
 * 	@param {Object} config.$appendTo : jQuery object of the dom element we want the rendered template to be appended to.
 *	@param {String} config.jsonURL : URL for the .json data model. Start with 'api/....'.
 *	@param {Function} config.callback : [optional] A callback function to be executed after 'render' has finished executing.
 *	@method (Private) fetch: Ajax-load Handlebars template, compile it and dispatch a 'templateLoaded' event on 'document' with instance-specific data
 *	@method (Private) render: Ajax-Load .json data, grab the compiled template and append it to config.$appendTo, optionally execute config.callback
 *	@method (Public) init: calls 'fect' and subscribes to 'templateLoaded' event, if the received templateLoaded data verifies with this instance, renders.
 */

var SCAC = SCAC || {};
SCAC.Renderer = SCAC.Renderer || function(config) {

    console.log('config is: ', config);    
	var templateName = config.templateName || '',
		templateURL = config.templateURL || '',
		$appendTo = config.$appendTo || $("body"),
		jsonURL = config.jsonURL || '',
		callback = config.callback || '',
        compiledTemplate,
		
    	fetch = function() {
	    	$.ajax({
                    url: SCAC.router.pathTo('templates/' + templateURL),
                    type: 'POST',
                    dataType: 'text'        
            })
            .done(function(loadedTemplate) {
                    var template = loadedTemplate;
                    compiledTemplate = Handlebars.compile(template);
                    $(document).trigger({
                        type : 'templateLoaded',
                        templateName: templateName,
                        $appendTo: $appendTo
                    });                        
            })
            .fail(function(jqxhr, textStatus, error) {
                    var err = textSTatus + ', ' + error;
                    console.log('Request for template Failed: ' + err);
            });
        }, 
    	
    	render = function() {
	    	$.ajax({
                    url: jsonURL,
                    type: 'POST',
                    dataType: 'json'        
            })
            .done(function(data) {
                    var context = data;
                    console.log('data is: ', data, '$appendTo is: ', $appendTo);
                    $(compiledTemplate({ posts : context.posts })).appendTo($appendTo);
                    
            })
            .fail(function(jqxhr, textStatus, error) {
                    var err = textSTatus + ', ' + error;
                    console.log('Request for API Failed: ' + err);
            });

            if(typeof callback === 'function') {
            	callback();    
            }	
    	};
    
    this.init = function() {
		fetch();
		$(document).on('templateLoaded', function(event) {
			console.log('templateName is: ', templateName);
			console.log('event.templateName is: ', event.templateName);
			if(event.templateName === templateName) {
				render();
			}	
		});
    }
    
    return this;
    			     
};