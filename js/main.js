"use strict"

/**
 * инициализация всех инициализаций
 */
$(document).ready(function()
{
	o2.init();
});
$(window).resize(function()
{
	o2.changeGlobalFontSize();
	o2.sliders.aboutSliders();
});
$(window).on('load', function ()
{
	o2.tabs.slidingUnderline();
	o2.scrollBlock();
	o2.goToCatalogRelated();
});

/**
 * основной объект
 * @type {object}
 */
var o2 =
{
	/**
	 * вызов функций, которые должны запускаться при загрузке страницы
	 */
	init: function()
	{
		this.makePhoneMask();

		// this.changeGlobalFontSize();
		this.sliders.init();
		this.yaMap.init();
		this.header.stickyHeader();
		this.tabs.slidingUnderline();
	},
	goToCatalogRelated: function()
	{
		if( window.location.hash == "#related")
		{
			$('html,body').animate({
		        scrollTop: $("#related-block").offset().top
		    }, 2000);
		}
		if(/^#tab\d+$/.test(window.location.hash))
		{
			var tabId = +window.location.hash.substr(window.location.hash.length - 1);
			o2.tabs.setTabByAnchor(tabId)

		}

	},
	goToAnchor: function(anchor)
	{
		$('html,body').animate({
	        scrollTop: $(anchor).offset().top
	    })
	},
	search:function()
	{
		$('.header-bot__item-search').toggleClass('active')
	},
	scrollBlock:function()
	{
		if($(document).width() <= 560)
			return false;

		var self = this;
		if($('.get-care-row').length != 0)
			var firstAnimationTop = $('.get-care-row').offset().top;

		var $window = $(window);
		$window.on('load scroll', function(){
			var top = $window.scrollTop();
			var height = $window.height();


			if (top + height > firstAnimationTop + height/3 * 1)
			{
				$('.get-care__number').removeClass('active');
				$('.get-care__info-header').removeClass('active');
				$('.get-care__info-text__item').removeClass('active');

				$($('.get-care__number')[0]).addClass('active');
				$($('.get-care__info-header')[0]).addClass('active');
				$($('.get-care__info-text__item')[0]).addClass('active');
			}
			if (top + height > firstAnimationTop + height/3 * 2)
			{
				$('.get-care__number').removeClass('active');
				$('.get-care__info-header').removeClass('active');
				$('.get-care__info-text__item').removeClass('active');

				$($('.get-care__number')[1]).addClass('active');
				$($('.get-care__info-header')[1]).addClass('active');
				$($('.get-care__info-text__item')[1]).addClass('active');
			}
			if (top + height > firstAnimationTop + height)
			{
				$('.get-care__number').removeClass('active');
				$('.get-care__info-header').removeClass('active');
				$('.get-care__info-text__item').removeClass('active');

				$($('.get-care__number')[2]).addClass('active');
				$($('.get-care__info-header')[2]).addClass('active');
				$($('.get-care__info-text__item')[2]).addClass('active');
			}
		})
	},
	litebox:
	{
		showLitebox: function(instance)
		{
			var src = $(instance).find('img').attr('src');
			$('.popup-litebox-wr').find('img').attr('src' , src);
			o2.popups.showPopup(3)
		},
	},
	tabs:
	{
		slidingUnderline: function()
		{
			if($(".slideline").length == 0)
				return false;
			var currentItem = $(".tabs-nav__item.active"),
				slideLine = $(".slideline");

			slideLine.css({
			"width": currentItem.width(),
			"left": currentItem.position().left
			});

			$('.tabs-nav').find(".tabs-nav__item").click(
				function()
				{
					slideLine.css({
						"width": $(this).width(),
						"left": $(this).position().left
					});
				});
			$('.tabs-nav').find(".tabs-nav__item").on('mouseleave', function ()
			{
				slideLine.css({
					"width": currentItem.width(),
					"left": currentItem.position().left
				});
			});
		},
		openTab: function(instance, event)
		{
			event.preventDefault();
			if(!$(instance).hasClass('active'))
			{
				this.setActive(instance);
				this.showTabById($(instance).data('tab-id'));
				this.slidingUnderline();
			}
		},
		setActive: function(instance)
		{
			$('.tabs-nav__item').removeClass('active');
			$(instance).addClass('active');
		},
		showTabById: function(id)
		{
			$('.tabs-content__item').hide();
			$('.tabs-content__item[data-tab-id="'+id+'"]').fadeIn(300);
		},
		setTabByAnchor: function(index)
		{
			$('.tabs-nav__item').removeClass('active');
			$('.tabs-nav__item[data-tab-id="'+index+'"]').click();
		}
	},
	sort:
	{
		setSort:function(instance)
		{
			$('.catalog-third-lvl__sort-left-item').removeClass('active');
			$(instance).addClass('active');
		}
	},
	careChange: function(index)
	{
		$('.get-care__number').removeClass('active');
		$('.get-care__info-header').removeClass('active');
		$('.get-care__info-text__item').removeClass('active');

		$($('.get-care__number')[index]).addClass('active');
		$($('.get-care__info-header')[index]).addClass('active');
		$($('.get-care__info-text__item')[index]).addClass('active');
	},
	servicesMobileText: function(instance)
	{
		$(instance).prev().toggleClass('active');
		$(instance).toggleClass('active');
		if($(instance).hasClass('active'))
			$(instance).html('<span>Скрыть</span>');
		else
			$(instance).html('<span>Показать полностью</span>');
	},
	yaMap:
	{
		init: function()
		{
			this.coords = this.getCoords();
			this.mainYaMap();
			this.contactsYaMap();
		},
		mainMap: '',
		contactsMap: '',
		coords: '',
		placemarks: [],
		getCoords: function()
		{
			return [
				{
					address: 'ул. Чкалова,19 / Калинина, 22',
					coords: [53.178723, 45.014930],
				},
				{
					address: 'ул. Новотерновская, д. 3, ТЦ «Форпост»',
					coords: [53.131345, 45.023331],
				},
				{
					address: 'ул. Чаадаева, 60 Б (магазин при производстве)',
					coords: [53.208316, 45.055585]
				}
			];
		},
		setCenter: function(map)
		{
			map.setBounds(map.geoObjects.getBounds());
		},
		newPlaceMark: function(map, coords, id, event)
		{
			var placemark = new ymaps.Placemark(coords,
				{
					balloonContentBody: false
				},
				{
					iconLayout: 'default#image',
					iconImageHref: 'images/icons/ballon.svg',
					iconImageSize: [33, 45],
					iconImageOffset: [0, -22.5],
					hideIconOnBalloonOpen: false,
					id: id,
				}
			);
			if(typeof event != 'undefined' )
				placemark.events.add('click', event);

			this.placemarks.push(placemark);
			map.geoObjects.add(placemark);
		},
		setActivePlacemark: function(activePlacemarkId)
		{
			for(var i = 0; i < this.placemarks.length; i++)
			{
				if(this.placemarks[i].options.get('id') == activePlacemarkId)
					this.placemarks[i].options.set('iconImageHref', 'images/icons/select-ballon.svg');
				else
					this.placemarks[i].options.set('iconImageHref', 'images/icons/ballon.svg');
			}
		},
		customZoom: function(options)
		{
			var map = options.map;
			var mapWrapper = options.mapWrapper;
			var mapClass = options.mapClass;
			var timeout = '';
			if(window.innerWidth > 1024)
			{
				$(mapWrapper).bind('mousewheel', function()
				{
					if(!$(mapClass).hasClass('scroll-enabled'))
					{
						clearTimeout(timeout);
						$(mapClass).addClass('scroll-locked');
						timeout = setTimeout(function()
						{
							$(mapClass).removeClass('scroll-locked');
						},1000)
					}
				})
				$(document).keydown((e) =>
				{
					if(e.keyCode == 17)
					{
						map.behaviors.enable('scrollZoom');
						$(mapClass).trigger('focus');
						$(mapClass).removeClass('scroll-locked');
						$(mapClass).addClass('scroll-enabled');
					}
					else
						map.behaviors.disable('scrollZoom');
				});
				$(document).keyup((e) =>
				{
					if(e.keyCode == 17)
					{
						$(mapClass).removeClass('scroll-enabled');
						map.behaviors.disable('scrollZoom');
					}
				});
			}
			else
			{

			}
		},
		mainYaMap: function()
		{
			if($('.main-ya-map').length == 0)
				return false;

			ymaps.ready(function()
			{
				this.mainMap = new ymaps.Map("main-ya-map",
				{
					center: [53.178723, 45.014930],
					zoom: 15,
					controls: ['default', 'zoomControl']
				});
				this.mainMap.behaviors.disable('scrollZoom');
				for(var i = 0; i < o2.yaMap.coords.length; i++)
				{
					o2.yaMap.newPlaceMark(this.mainMap, o2.yaMap.coords[i].coords, i);
				}
				o2.yaMap.setCenter(this.mainMap);
				var mapCenter = this.mainMap.getGlobalPixelCenter();
				this.mainMap.setGlobalPixelCenter([ mapCenter[0], mapCenter[1] - 11 ]);
				o2.yaMap.customZoom({
					map: this.mainMap,
					mapWrapper: '.main-contacts__right',
					mapClass: '.main-ya-map',
				});
			});
		},
		contactsYaMap: function()
		{
			if($('.contacts-ya-map').length != 0)
				ymaps.ready(function()
				{
					this.contactsMap = new ymaps.Map("contacts-ya-map",
					{
						center: [53.178723, 45.014930],
						zoom: 15,
						controls: ['default', 'zoomControl']
					});
					this.contactsMap.behaviors.disable('scrollZoom');
					for(var i = 0; i < o2.yaMap.coords.length; i++)
					{
						o2.yaMap.newPlaceMark(this.contactsMap, o2.yaMap.coords[i].coords, i, function(e)
						{
							var target = e.get('target');
							var id = target.options.get('id');
							o2.sliders.contactSlider.showSlide(id);
						});
					}
					o2.yaMap.setActivePlacemark(0);
					o2.yaMap.setCenter(this.contactsMap);
					var mapCenter = this.contactsMap.getGlobalPixelCenter();
					this.contactsMap.setGlobalPixelCenter([ mapCenter[0], mapCenter[1] - 20 ]);
					o2.yaMap.customZoom({
						map: this.contactsMap,
						mapWrapper: '.contacts-map__left',
						mapClass: '.contacts-ya-map',
					});
				});
		}
	},
	sliders:
	{
		init: function()
		{
			this.defaultSlider();
			this.bannerSlider();
			this.serviceMobileSlider();
			this.catalogSlider();
			this.helpSlider();
			this.ourWoksMobileSlider();
			this.contactSlider.init();
			this.aboutSliders();
			this.sameSlider();
		},
		checkExistenceBanner: function(bannerName)
		{
			if($(bannerName).length != 0)
				return true;
			else
				return false;
		},
		catalogSlider: function()
		{
			if(!this.checkExistenceBanner('.catalog-third-lvl__slider-items'))
				return false;

			$('.catalog-third-lvl__slider-items').slick(
			{
				slidesToShow: 5,
				slidesToScroll: 1,
				infinite: false,
				autoplay: false,
				vertical: true,
				arrows: true,
				responsive:
				[
					{
						breakpoint: 560,
						settings:
						{
							slidesToShow: 4,
						}
					}
				]
			})

		},
		helpSlider: function()
		{
			if(!this.checkExistenceBanner('.help') || $(window).width() > 560)
				return false;

			$('.help').slick(
			{
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: false,
				arrows: false,
				dots: true,
			})
		},
		aboutSliders: function()
		{
			if(!this.checkExistenceBanner('.about-slider') || $(window).width() > 560)
				return false;

			$('.about-slider').slick(
			{
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: false,
				arrows: false,
				dots: true,
				adaptiveHeight: true,
			})
		},
		defaultSlider: function()
		{
			if(!this.checkExistenceBanner('.default-slider'))
				return false;

			$('.default-slider').slick(
			{
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 4,
				autoplay: false,
				arrows: true,
				responsive:
				[
					{
						breakpoint: 1025,
						settings:
						{
							slidesToShow: 3,
							slidesToScroll: 3,
						}
					},
					{
						breakpoint: 560,
						settings:
						{
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						}
					}
				]
			})
		},
		sameSlider: function()
		{
			if(!this.checkExistenceBanner('.same-slider-container'))
				return false;

			$('.same-slider-container').slick(
			{
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 4,
				autoplay: false,
				arrows: true,
				responsive:
				[
					{
						breakpoint: 1025,
						settings:
						{
							slidesToShow: 3,
							slidesToScroll: 3,
							dots: true,
							arrows: false
						}
					},
					{
						breakpoint: 560,
						settings:
						{
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						}
					}
				]
			})
		},
		bannerSlider: function()
		{
			if(!this.checkExistenceBanner('.banner-slider'))
				return false;
			$('.banner-slider').slick(
			{
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				arrows: true,
				dots: true,
				prevArrow: $('.banner-arrow--prev'),
				nextArrow: $('.banner-arrow--next'),
				responsive:
				[
					{
						breakpoint: 560,
						settings:
						{
							arrows: false
						}
					}
				]
			})
		},
		serviceMobileSlider: function()
		{
			if(!this.checkExistenceBanner('.service-mobile-slider') || $('html').width() > 561)
				return false;

			$('.service-mobile-slider').slick(
			{
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: false,
				arrows: false,
				centerMode: true,
				variableWidth: true,
				dots: true,
			})
		},
		ourWoksMobileSlider: function()
		{
			if(!this.checkExistenceBanner('.our-works-mobile-slider') || $('html').width() > 561)
				return false;

			$('.our-works-mobile-slider').slick(
			{
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: false,
				arrows: false,
				dots: true,
			})
		},
		contactSlider:
		{
			slideCount: 0,
			currentSlide: 0,
			init: function()
			{
				if(!o2.sliders.checkExistenceBanner('.contact-images__slider'))
					return false;

				$('.contact-images__slider').slick(
				{
					infinite: false,
					slidesToShow: 1,
					slidesToScroll: 1,
					autoplay: false,
					arrows: false,
					speed: 500,
					swipe: false,
					cssEase: 'linear',
					dots: false,
				});

				this.currentSlide = $('.contact-images__slider').slick('slickCurrentSlide');
				this.slideCount = $('.contact-images__slide').length;
				$('._contact-slide-count').html(this.slideCount);
				this.setCurrentSlide(this.currentSlide);
			},
			setCurrentSlide: function(slideId)
			{
				$('._contact-slide-current').html(++slideId);
			},
			updateContactInfo: function(contactId)
			{
				$('._contact-address').fadeOut(300, function()
				{
					$(this).html(o2.yaMap.coords[contactId].address);
					$(this).fadeIn(300);
				})
			},
			showSlide: function(slideId)
			{
				o2.yaMap.setActivePlacemark(slideId);
				$('.contact-images__slider').slick('slickGoTo', slideId);
				this.currentSlide = slideId;
				this.updateContactInfo(slideId);
				this.setCurrentSlide(slideId);
			},
			prevSlide: function()
			{
				if(this.currentSlide == 0)
					return false;

				this.currentSlide--;
				if(this.currentSlide == 0)
				{
					$('.top-pagination__arrow--left').addClass('disable');
				}
				$('.top-pagination__arrow--right').removeClass('disable');
				this.showSlide(this.currentSlide);
			},
			nextSlide: function()
			{
				if(this.currentSlide == this.slideCount -1 )
					return false;

				this.currentSlide++;
				if(this.currentSlide == this.slideCount-1)
				{
					$('.top-pagination__arrow--right').addClass('disable');
				}
				$('.top-pagination__arrow--left').removeClass('disable');
				this.showSlide(this.currentSlide);
			}
		}
	},
	header:
	{
		didScroll: false,
		lastScrollTop : 0,
		delta : 5,
		navbarHeight : $('header').outerHeight(),
		scrollTop: 0,
		setActiveMenuItem: function(instance, index)
		{
			if($(instance).hasClass('active'))
			{
				this.unsetActiveMenuItem();
				return false;
			}
			this.unsetActiveMenuItem();
			$(instance).addClass('active')
			$('#drop'+index).addClass('active')
			var lostWidth = $('body').width();
			$('body').addClass('popup-showed');
			var newWidth = $('body').width();
			$('body').css({'padding-right': newWidth - lostWidth + 'px'})
			$('header').css({'padding-right': newWidth - lostWidth + 'px'})
		},
		unsetActiveMenuItem: function()
		{
			$('.header-bot__item').removeClass('active');
			$('.header__dropdown-menu').removeClass('active');
			$('body').removeClass('popup-showed');
			$('body').css({'padding-right': 0})
			$('header').css({'padding-right': 0})
		},
		stickyHeader:function ()
		{
			var self = this;
			$(window).scroll(function(event){
				self.didScroll = true;
				setInterval(function()
				{
					if (self.didScroll) {
						self.hasScrolled();
						self.didScroll = false;
					}
				}, 50);
			});
		},
		hasScrolled:function () {
			var st = $(window).scrollTop();
			// Make sure they scroll more than delta
			if(Math.abs(this.lastScrollTop - st) <= this.delta)
				return;
			if (st > this.lastScrollTop && st > this.navbarHeight){
				// Scroll Down
				$('header').addClass('nav-up');
			} else {
				// Scroll Up
				if(st + $(window).height() < $(document).height()) {
					$('header').removeClass('nav-up');
				}
			}

			this.lastScrollTop = st;
		}
	},
	forms:
	{
		isValid: function(form)
		{
			var inputs = $(form).find('._required');
			var valid = false;
			$(inputs).each(function(index, item)
			{
				if($(item).val() == '')
				{
					$(item).addClass('error');
					valid = false;
				}
				else if($(item).hasClass('_phone-mask') && !$(item).inputmask("isComplete"))
				{
					$(item).addClass('error')
					valid = false;
				}
				else
				{
					$(item).removeClass('error');
					valid = true;
				}
			})
			return valid;
		},
		loadFile: function(instance, event)
		{
			var loadedFileName = event.target.value.split('\\').pop();
			this.showLoadedFileName(loadedFileName);
		},
		deleteFile: function(instance)
		{
			$(instance).parents('.popup-loaded-file').fadeOut(300, function() {
					$(this).remove();
				});
			$('.file-input').val('');
		},
		showLoadedFileName: function(fileName)
		{
			var fileTmp =   '<div class="popup-loaded-file">' +
							'<span class="del-icon" onclick="o2.forms.deleteFile(this)"></span>' +
							'<span>' + fileName + '</span>' +
							'</div>'
			$('.loaded-file-name').html(fileTmp);
			$('.loaded-file-name-wr').fadeIn(300);
		}
	},
	popups:
	{
		showPopup: function(popupId)
		{
			this.closePopup('before');
			var lostWidth = $('body').width();
			$('body').addClass('popup-showed');
			var newWidth = $('body').width();
			$('.popup-overlay').addClass('showed');
			$('.popup-wr[data-popup-id=' + popupId + ']').show();
			setTimeout(function(){
					$('.popup-wr[data-popup-id=' + popupId + ']').addClass('showed');
				},50)
			$(document).keydown(function(eventObject){
				if (eventObject.which == 27)
					o2.popups.closePopup();
			});

			$('body').css({'padding-right': newWidth - lostWidth + 'px'})
			$('header').css({'padding-right': newWidth - lostWidth + 'px'})
		},
		closePopup: function(evt)
		{
			$(document).off('keydown');
			$('body').removeClass('popup-showed');

			$('.popup-wr').removeClass('showed');
			$('.popup-overlay').removeClass('showed');
			if(evt == 'before')
			{
				$('.popup-wr').hide()
				return false
			}
			setTimeout(function(){
				$('.popup-wr').hide()
			},200);
			$('body').css({'padding-right': 0})
			$('header').css({'padding-right': 0})
		},
		sendPopup: function(instance, event)
		{
			event.preventDefault();
			if(o2.forms.isValid(instance))
				this.closePopup();
		}
	},
	makePhoneMask: function()
	{
		$('._phone-mask').inputmask({"mask": "+7 (999) 999-99-99"});
	},
	changeGlobalFontSize: function()
	{
		var currentWidth = window.innerWidth;
		var desktopPoint = 1344;
		var tabletPoint = 1024;
		var mobilePoint = 560;
		var newSize = 16;
		if(currentWidth >= desktopPoint)
		{
			newSize = 16
		}
		if(currentWidth <= desktopPoint && currentWidth > tabletPoint)
		{
			newSize = (currentWidth / desktopPoint) * 16;
			if(newSize == 0)
				newSize = 16;
		}
		else if(currentWidth <= tabletPoint && currentWidth > mobilePoint)
		{
			newSize = (currentWidth / tabletPoint)	* 16;
			if(newSize == 0)
				newSize = 16;
		}
		else if(currentWidth <= mobilePoint)
		{
				newSize = 16;
		}
		$('html').css({'font-size': newSize})

	},
	// custom placeholder
	customPlaceholder:
	{
		customPlaceholder: function(instance)
		{
			$(instance).prev().addClass('onFocus')
		},
		customPlaceholderHide: function(instance)
		{
			if($(instance).val() != "")
				return false
			$(instance).prev().toggleClass('onFocus')
		},
	}
}