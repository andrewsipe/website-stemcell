var app = (function(w, d, $){
        'use strict';
                
        
        var elements = {},	
		settings = {},
		dimensions = {},
		captions = [],
		subtitles = ['Relevant', 'Dynamic', 'Visible', 'Equitable', 'Accessible', 'Responsible', 'Tangible'];
		settings.subtitles = {};
		settings.subtitles.counter = 1;
		elements.homepageSlideContainer = $('.slider-wrapper');
		elements.homePageSlideCaptionToggle = $('.toggle-caption');
		elements.homePageSlideCaptionTitle = $('.caption:nth(0)').find('.caption-title');
		elements.homePageSlideCaptionBody = $('.caption:nth(0)').find('.caption-body');
		elements.rotatingSubtitle = $('.rotating-subtitle').find('.rotating');
		elements.sideBar = {};
		elements.sideBar.self = $('.side-bar');
		elements.sideBar.sideNav = elements.sideBar.self.find('.side-nav');
		dimensions.sideBar = elements.sideBar.self.width();
		elements.sideBar.hasDropDown = elements.sideBar.sideNav.find('.has-dropdown');
		elements.sideBar.dropDown = elements.sideBar.hasDropDown.find('.dropdown');
		settings.isHomePageSliderCaptionOpen = false;
		settings.slides = {};
		settings.slides.homePage = {
			play: {
				active: false,
				effect: 'fade',
				interval: '3000',
				auto: true,
				swap: false,
				paueOnHover: false
			},
			effect: {
				fade: {
					speed: 300,
					crossfade: false
				}
			},
			navigation: {
				active: false,
				effect: 'fade'
			},
			pagination: {
				active: false
			},
			callback: {
				complete: function(number) {
					console.log(number);
					if(number < 1) {
						number = captions.length;
					}
					//console.log(captions[number-1]);
					
					//elements.homePageSlideCaptionTitle.text(captions[number-1].title);
					console.log(captions.length);
					//elements.homePageSlideCaptionBody.html(captions[number-1].body)
				}
			}
		};
		subtitles.get = function() {
			return subtitles[_.random(subtitles.length-1)];
		};
		var rotateSlideShowCaptions = function() {
			var caption = $('.caption');
			$('.caption:not(:first)').hide();	
		};
		var setupDimensions = function() {
			elements.homepageSlideContainer.css({
				height: $(window).height()-($('.title-social').height()+ $('.logo-menu-wrapper').height())	
			});
		};
		var initSlideshow = function(wrapperEl, args) {
			console.log('init slide show');
			$(wrapperEl).slidesjs(args);
		};
		var initFoundation = function() {
			$(d).foundation('topbar section clearing');
		};
		var initSideBarSticky = function() {
			//console.log(elements.sideBar.self);
			$(w).on('scroll', function() {
				var x = elements.sideBar.self.offset().left;
				$('.biographies').waypoint({
					handler: function(direction) {
						if( $(w).scrollTop() > 0 &&  direction === 'down') {
							elements.sideBar.self.css({
								position: 'fixed',
								width: '250px',
								left: x,
								top: '2em'
							});
						} else {
							elements.sideBar.self.css({
								position: 'static'
								
							});
						}
						
					},
					offset : 110
				})
			});
			$('.anchor').on('click', function(e) {
				e.preventDefault();
				var link = $(this),	
					name = $(this).attr('href').substring(1),
					dist = $('#'+name).offset().top - 130;
				$('html,body').animate({
					scrollTop : dist
				},400, function() {
					$('.anchor').parent('li').removeClass('active');
					link.parent('li').addClass('active');
				});
	
	
			});	
		};
		var initRotatingSubtitles = function() {
			var rotateSubtitle = function() {
				elements.rotatingSubtitle.transition({
					opacity: 0
				}, 500, 'ease', function() {
					$(this).text(subtitles.get()+'.');
					$(this).transition({
						opacity: 1
					}, 500 , 'ease');
				});
				w.setTimeout(function() {
					rotateSubtitle();
				}, 4000);
			};
			w.setTimeout(function() {
				rotateSubtitle();
			}, 4000);
		};
		var storeSlideCaptions = function() {
			$('.caption').each(function() {
				var title = $(this).find('.caption-title').text(),
					body = $(this).find('.caption-body').html(),
					caption = {};
				caption.title = $.trim(title);
				caption.body = body;
				captions.push(caption);
			});
			console.log(captions);
			return captions;
		};
                      
        
        var $DOM = {};
        $DOM.body = $('body');
        $DOM.container = $('.container');
        $DOM.ajaxLoader = $('.ajax-loader');
        
        var templates = {},
        compiledTemplate,
        

        
        
        fetchTemplate = function() {
                $.ajax({
                        url: SCAC.router.pathTo('templates/home/slides.handlebars'),
                        type: 'POST',
                        dataType: 'text'        
                })
                .done(function(loadedTemplate) {
                        templates.slides = loadedTemplate;
                        compiledTemplate = Handlebars.compile(templates.slides);
                        console.log('Slides template loaded');
                        $(d).trigger('templateLoaded');                        
                })
                .fail(function(jqxhr, textStatus, error) {
                        var err = textSTatus + ', ' + error;
                        console.log('Request for template Failed: ' + err);
                }); 
 
        },
        
        render = function(callback) {                
                
                console.log('render');
                $.ajax({
                        url: 'api/get_posts/?post_type=home-page-slides',
                        type: 'POST',
                        dataType: 'json'        
                })
                .done(function(data) {
                        console.log(data);
                        var context = data;
                        $DOM.ajaxLoader.fadeOut(200);
                        
                        console.log(compiledTemplate({ posts : context }));
                        $(compiledTemplate({ posts : context.posts })).appendTo($('.slides'));
                        
                })
                .fail(function(jqxhr, textStatus, error) {
                        var err = textSTatus + ', ' + error;
                        console.log('Request for API Failed: ' + err);
                });
                callback();
                
        };
        
        
        
        var attachEvents = function() {
	        elements.homePageSlideCaptionToggle.on('click', function(event) {
				var self = $(this),
					caption = self.next('.caption'),
					captionBody = caption.children('.caption-body'),
					captionBodyHeight = captionBody.innerHeight();
				switch(settings.isHomePageSliderCaptionOpen) {
					case false:
						caption.transition({
							y: -captionBodyHeight
						}, 200, 'ease', function() {
							captionBody.transition({
								scale: 1,
								opacity: 1
							}, 100, 'snap', function() {
								self.removeClass('icon-plus').addClass('icon-minus');
								settings.isHomePageSliderCaptionOpen = true;
							});
						});
					break;
					case true:
						captionBody.transition({
							scale: .01,
							opacity: 0
						}, 100, 'snap', function() {
							caption.transition({
								y: 0
							}, 300, 'snap', function() {
								self.removeClass('icon-minus').addClass('icon-plus');
								settings.isHomePageSliderCaptionOpen = false;
							});
						});
					break;
				}
			});
	        w.addEventListener('hashchange', function() {
	                console.log('hash just changed');        
	                router();
	        });
        },
        
        init = function() {

            SCAC.router.route();
            
            
            /*
            fetchTemplate();
            $(d).on('templateLoaded', function() {
                console.log('templates is: ', templates);
                render(function(){
                	w.setTimeout(function() {
	                	initSlideshow($('.slides'), settings.slides.homePage);
	                	console.log('fire');
                	}, 3000);
                	
                });
            });
            */
            
			/*      
        
            $(d).on('allTemplatesRendered', function() {
	        	$DOM.ajaxLoader.fadeOut(300);    
            });
            */
            
        
        	window.myRenderer = new SCAC.Renderer({
	        	templateName 	: 'home',
	        	templateURL 	: 'home/home.handlebars',
	        	$appendTo 		: $('#main'),
	        	jsonURL			: 'api/get_posts/?post_type=home-page-slides',
	        	callback		: function() {
		        	console.log('Hello from myRenderer!');
		        	
		        	storeSlideCaptions();
		 			rotateSlideShowCaptions();
		 			setupDimensions();
		 			initRotatingSubtitles();
		 			imagesLoaded($('.slides'), function(instance) {
			 			//alert('Hello');
			 			initFoundation();
			 			w.setTimeout(function() {
				 			initSlideshow($('.slides'), settings.slides.homePage);		
				 			$('.ajax-loading').fadeOut(300);
			 			},2000);
		 			});
	                	
	                	
		            attachEvents(); 
	        	}	
        	}).init();
        };
        	
                
        return {
            init: init
        };
        
})(window, document, jQuery);

window.onload = app.init();