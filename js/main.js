 /*jslint browser: true, forin: true, white: false, on: true, fragment: true, */
var app = (function (w, d, $, _) {

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
				elements.homePageSlideCaptionTitle.text(captions[number-1].title);
				elements.homePageSlideCaptionBody.html(captions[number-1].body);		
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
		return captions;
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
	};
	return {
		init : function() {
			initFoundation();
			storeSlideCaptions();
			initSlideshow('.slides',settings.slides.homePage);
 			rotateSlideShowCaptions();
 			attachEvents();
 			setupDimensions();
 			initRotatingSubtitles();
			initSideBarSticky();
		}
	};

})(window, document, jQuery, _);

window.onload = app.init;