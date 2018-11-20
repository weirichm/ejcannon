
/* Table of Content
====================
1. Page transitions / preloader
2. Disable right click
3. Smooth scrolling
4. Header
5. Main menu
6. Page header
7. Defer videos
8. Isotope
9. OWL Carousel
10. lightGallery
11. YTPlayer
12. Add to favorite button
13. Universal PHP Mail Feedback Script
14. Fade out element with page scroll
15. Parallax effect
16. Remove input placeholder on focus
17. Albums
18. Single gallery
19. Limit number of characters/words in element
20. Footer
21. Scroll to top button
22. Miscellaneous
*/
var $document = $(document),
  $window = $(window),
  $html = $("html"),
  $body = $("body"),

  isDesktop = $html.hasClass("desktop");

var plugins = {
  rdNavbar: $(".rd-navbar"),
  counter: $(".counter"),
  rdMailForm: $(".rd-mailform"),
  rdInputLabel: $(".form-label"),
  regula: $("[data-constraints]"),
  radio: $("input[type='radio']"),
  checkbox: $("input[type='checkbox']"),
	lightGallery: $("[data-lightgallery='group']"),
	lightGalleryItem: $("[data-lightgallery='item']"),
	lightDynamicGalleryItem: $("[data-lightgallery='dynamic']"),
	maps:             $(".google-map-container"),
	videBG: $('.bg-vide'),
  captcha: $('.recaptcha'),
  mailchimp: $('.mailchimp-mailform'),
	owl: $(".owl-carousel"),
  campaignMonitor: $('.campaign-mailform')
};


(function ($) {
	'use strict';


  var isNoviBuilder = window.xMode;

  $window.load(function () {
    setTimeout(function () {
      $('body').addClass('loader-effect')
    }, 500);


    $(".animsition").animsition({
      inClass: 'fade-in-down-sm',
      outClass: 'fade-out-down-sm',
      inDuration: 800,
      outDuration: 500,
      // linkElement:   '.animsition-link',
      linkElement: 'a:not([target="_blank"]):not([href^="#"]):not([class*="lg-trigger"])', // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
      loading: true,
      loadingParentElement: 'html', //animsition wrapper element
      loadingClass: 'animsition-loading',
      loadingInner: '', // e.g '<img src="assets/img/loading.svg" />'
      timeout: true,
      timeoutCountdown: 2500,
      onLoadEvent: true,
      browser: ['animation-duration', '-webkit-animation-duration', '-o-animation-duration'], // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser. The default setting is to disable the "animsition" in a browser that does not support "animation-duration".

      overlay : false,
      overlayClass : 'animsition-overlay-slide',
      overlayParentElement : 'html',
      transition: function(url){ window.location.href = url; }
    });
  });

	// ======================================== =======
	// Page transitions / preloader (Animsition)
	// More info: http://git.blivesta.com/animsition/
	// ===============================================




  /**
   * attachFormValidator
   * @description  attach form validation to elements
   */
  function attachFormValidator(elements) {
    for (var i = 0; i < elements.length; i++) {
      var o = $(elements[i]), v;
      o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
      v = o.parent().find(".form-validation");
      if (v.is(":last-child")) {
        o.addClass("form-control-last-child");
      }
    }

    elements
      .on('input change propertychange blur', function (e) {
        var $this = $(this), results;

        if (e.type !== "blur") {
          if (!$this.parent().hasClass("has-error")) {
            return;
          }
        }

        if ($this.parents('.rd-mailform').hasClass('success')) {
          return;
        }

        if ((results = $this.regula('validate')).length) {
          for (i = 0; i < results.length; i++) {
            $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
          }
        } else {
          $this.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      })
      .regula('bind');

    var regularConstraintsMessages = [
      {
        type: regula.Constraint.Required,
        newMessage: "The text field is required."
      },
      {
        type: regula.Constraint.Email,
        newMessage: "The email is not a valid email."
      },
      {
        type: regula.Constraint.Numeric,
        newMessage: "Only numbers are required"
      },
      {
        type: regula.Constraint.Selected,
        newMessage: "Please choose an option."
      }
    ];


    for (var i = 0; i < regularConstraintsMessages.length; i++) {
      var regularConstraint = regularConstraintsMessages[i];

      regula.override({
        constraintType: regularConstraint.type,
        defaultMessage: regularConstraint.newMessage
      });
    }
  }


	// Vide
	if ( plugins.videBG.length ) {
		for ( var i = 0; i < plugins.videBG.length; i++ ) {
			var $element = $(plugins.videBG[i]),
				options = $element.data('vide-options'),
				path = $element.data('vide-bg');

			$element.vide( path, options );

			var videObj = $element.data('vide').getVideoObject();

			if ( isNoviBuilder ) {
				videObj.pause();
			} else {
				document.addEventListener( 'scroll', function ( $element, videObj ) {
					return function () {
						if ( isScrolledIntoView( $element ) ) videObj.play();
						else videObj.pause();
					}
				}( $element, videObj ) );
			}
		}
	}

  /**
   * isValidated
   * @description  check if all elemnts pass validation
   */
  function isValidated(elements, captcha) {
    var results, errors = 0;

    if (elements.length) {
      for (j = 0; j < elements.length; j++) {

        var $input = $(elements[j]);
        if ((results = $input.regula('validate')).length) {
          for (k = 0; k < results.length; k++) {
            errors++;
            $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
          }
        } else {
          $input.siblings(".form-validation").text("").parent().removeClass("has-error")
        }
      }

      if (captcha) {
        if (captcha.length) {
          return validateReCaptcha(captcha) && errors === 0
        }
      }

      return errors === 0;
    }
    return true;
  }

	/**
	 * @desc Initialize the gallery with set of images
	 * @param {object} itemsToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).lightGallery({
				thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
				selector: "[data-lightgallery='item']",
				autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
				pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
				addClass: addClass,
				mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
				loop: $(itemsToInit).attr("data-lg-loop") !== "false"
			});
		}
	}

	/**
	 * @desc Initialize the gallery with dynamic addition of images
	 * @param {object} itemsToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initDynamicLightGallery(itemsToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemsToInit).on("click", function () {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector: "[data-lightgallery='item']",
					autoplay: $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause: parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass: addClass,
					mode: $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop: $(itemsToInit).attr("data-lg-loop") !== "false",
					dynamic: true,
					dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
				});
			});
		}
	}

	/**
	 * @desc Initialize the gallery with one image
	 * @param {object} itemToInit - jQuery object
	 * @param {string} addClass - additional gallery class
	 */
	function initLightGalleryItem(itemToInit, addClass) {
		if (!isNoviBuilder) {
			$(itemToInit).lightGallery({
				selector: "this",
				addClass: addClass,
				counter: false,
				youtubePlayerParams: {
					modestbranding: 1,
					showinfo: 0,
					rel: 0,
					controls: 0
				},
				vimeoPlayerParams: {
					byline: 0,
					portrait: 0
				}
			});
		}
	}

  /**
   * Radio
   * @description Add custom styling options for input[type="radio"]
   */
  if (plugins.radio.length) {
    var i;
    for (i = 0; i < plugins.radio.length; i++) {
      $(plugins.radio[i]).addClass("radio-custom").after("<span class='radio-custom-dummy'></span>")
    }
  }

  /**
   * Checkbox
   * @description Add custom styling options for input[type="checkbox"]
   */
  if (plugins.checkbox.length) {
    var i;
    for (i = 0; i < plugins.checkbox.length; i++) {
      $(plugins.checkbox[i]).addClass("checkbox-custom").after("<span class='checkbox-custom-dummy'></span>")
    }
  }

  /**
   * RD Input Label
   * @description Enables RD Input Label Plugin
   */

  if (plugins.rdInputLabel.length) {
    plugins.rdInputLabel.RDInputLabel();
  }


  /**
   * Regula
   * @description Enables Regula plugin
   */

  if (plugins.regula.length) {
    attachFormValidator(plugins.regula);
  }


  /**
   * MailChimp Ajax subscription
   */

  if (plugins.mailchimp.length) {
    for (i = 0; i < plugins.mailchimp.length; i++) {
      var $mailchimpItem = $(plugins.mailchimp[i]),
        $email = $mailchimpItem.find('input[type="email"]');

      // Required by MailChimp
      $mailchimpItem.attr('novalidate', 'true');
      $email.attr('name', 'EMAIL');

      $mailchimpItem.on('submit', $.proxy(function (e) {
        e.preventDefault();

        var $this = this;

        var data = {},
          url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
          dataArray = $this.serializeArray(),
          $output = $("#" + $this.attr("data-form-output"));

        for (i = 0; i < dataArray.length; i++) {
          data[dataArray[i].name] = dataArray[i].value;
        }

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            $output.html(resp.msg).addClass('active');

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function (data) {
            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        return false;
      }, $mailchimpItem));
    }
  }


  /**
   * Campaign Monitor ajax subscription
   */
  if (plugins.campaignMonitor.length) {
    for (i = 0; i < plugins.campaignMonitor.length; i++) {
      var $campaignItem = $(plugins.campaignMonitor[i]);

      $campaignItem.on('submit', $.proxy(function (e) {
        var data = {},
          url = this.attr('action'),
          dataArray = this.serializeArray(),
          $output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
          $this = $(this);

        for (i = 0; i < dataArray.length; i++) {
          data[dataArray[i].name] = dataArray[i].value;
        }

        $.ajax({
          data: data,
          url: url,
          dataType: 'jsonp',
          error: function (resp, text) {
            $output.html('Server error: ' + text);

            setTimeout(function () {
              $output.removeClass("active");
            }, 4000);
          },
          success: function (resp) {
            $output.html(resp.Message).addClass('active');

            setTimeout(function () {
              $output.removeClass("active");
            }, 6000);
          },
          beforeSend: function (data) {
            // Stop request if builder or inputs are invalide
            if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
              return false;

            $output.html('Submitting...').addClass('active');
          }
        });

        return false;
      }, $campaignItem));
    }
  }


  /**
   * RD Mailform
   * @version      3.2.0
   */
  if (plugins.rdMailForm.length) {
    var i, j, k,
      msg = {
        'MF000': 'Successfully sent!',
        'MF001': 'Recipients are not set!',
        'MF002': 'Form will not work locally!',
        'MF003': 'Please, define email field in your form!',
        'MF004': 'Please, define type of your form!',
        'MF254': 'Something went wrong with PHPMailer!',
        'MF255': 'Aw, snap! Something went wrong.'
      };

    for (i = 0; i < plugins.rdMailForm.length; i++) {
      var $form = $(plugins.rdMailForm[i]),
        formHasCaptcha = false;

      $form.attr('novalidate', 'novalidate').ajaxForm({
        data: {
          "form-type": $form.attr("data-form-type") || "contact",
          "counter": i
        },
        beforeSubmit: function (arr, $form, options) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            inputs = form.find("[data-constraints]"),
            output = $("#" + form.attr("data-form-output")),
            captcha = form.find('.recaptcha'),
            captchaFlag = true;

          output.removeClass("active error success");

          if (isValidated(inputs, captcha)) {

            // veify reCaptcha
            if (captcha.length) {
              var captchaToken = captcha.find('.g-recaptcha-response').val(),
                captchaMsg = {
                  'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
                  'CPT002': 'Something wrong with google reCaptcha'
                };

              formHasCaptcha = true;

              $.ajax({
                method: "POST",
                url: "bat/reCaptcha.php",
                data: {'g-recaptcha-response': captchaToken},
                async: false
              })
                .done(function (responceCode) {
                  if (responceCode !== 'CPT000') {
                    if (output.hasClass("snackbars")) {
                      output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

                      setTimeout(function () {
                        output.removeClass("active");
                      }, 3500);

                      captchaFlag = false;
                    } else {
                      output.html(captchaMsg[responceCode]);
                    }

                    output.addClass("active");
                  }
                });
            }

            if (!captchaFlag) {
              return false;
            }

            form.addClass('form-in-process');

            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
              output.addClass("active");
            }
          } else {
            return false;
          }
        },
        error: function (result) {
          if (isNoviBuilder)
            return;

          var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
            form = $(plugins.rdMailForm[this.extraData.counter]);

          output.text(msg[result]);
          form.removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }
        },
        success: function (result) {
          if (isNoviBuilder)
            return;

          var form = $(plugins.rdMailForm[this.extraData.counter]),
            output = $("#" + form.attr("data-form-output")),
            select = form.find('select');

          form
            .addClass('success')
            .removeClass('form-in-process');

          if (formHasCaptcha) {
            grecaptcha.reset();
          }

          result = result.length === 5 ? result : 'MF255';
          output.text(msg[result]);

          if (result === "MF000") {
            if (output.hasClass("snackbars")) {
              output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active success");
            }
          } else {
            if (output.hasClass("snackbars")) {
              output.html(' <p class="snackbars-left"><span class="icon fa fa-exclamation text-middle"></span><span>' + msg[result] + '</span></p>');
            } else {
              output.addClass("active error");
            }
          }

          form.clearForm();

          if (select.length) {
            select.select2("val", "");
          }

          form.find('input, textarea').trigger('blur');

          setTimeout(function () {
            output.removeClass("active error success");
            form.removeClass('success');
          }, 3500);
        }
      });
    }
  }

	// ==========================================
	// Disable right click (uncomment if needed)
	// ==========================================

	// $(document)[0].oncontextmenu = function() { return false; }
	// $(document).mousedown(function(e) {
	//   if( e.button == 2 ) {
	//       alert('Sorry, this functionality is disabled!');
	//       return false;
	//   } else {
	//       return true;
	//   }
	// });

  /**
   * isScrolledIntoView
   * @description  check the element whas been scrolled into the view
   */
  function isScrolledIntoView(elem) {
    if (!isNoviBuilder) {
      return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }
    else {
      return true;
    }
  }





  /**
   * jQuery Count To
   * @description Enables Count To plugin
   */
  if (plugins.counter.length) {
    var i;

    for (i = 0; i < plugins.counter.length; i++) {
      var $counterNotAnimated = $(plugins.counter[i]).not('.animated');
      $document
        .on("scroll", $.proxy(function () {
          var $this = this;

          if ((!$this.hasClass("animated")) && (isScrolledIntoView($this))) {
            $this.countTo({
              refreshInterval: 40,
              from: 0,
              to: parseInt($this.text(), 10),
              speed: $this.attr("data-speed") || 1000
            });
            $this.addClass('animated');
          }
        }, $counterNotAnimated))
        .trigger("scroll");
    }
  }

  /**
   * WOW
   * @description Enables Wow animation plugin
   */
  if ($html.hasClass("wow-animation") && $(".wow").length) {
    new WOW().init();
  }



  /**
   * initOnView
   * @description  calls a function when element has been scrolled into the view
   */
  function lazyInit(element, func) {
    $window.on('load scroll', function () {
      if ((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
        func.call();
        element.addClass('lazy-loaded');
      }
    });
  }


  // =========================================================================
  // Smooth scrolling
  // Note: requires Easing plugin - http://gsgd.co.uk/sandbox/jquery/easing/
  // =========================================================================

  $('.sm-scroll').on("click",function() {
    if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000, 'easeInOutExpo');
        return false;
      }
    }
  });







   // Header Filled (cbpAnimatedHeader)
   // More info: http://tympanus.net/codrops/2013/06/06/on-scroll-animated-header/
   // ====================================
   var cbpAnimatedHeader = (function() {

      var docElem = document.documentElement,
         header = document.querySelector( '#header' ),
         didScroll = false,
         changeHeaderOn = 1;

      function init() {
         window.addEventListener( 'scroll', function( event ) {
             if( !didScroll ) {
                 didScroll = true;
                 setTimeout( scrollPage, 300 );
             }
         }, false );
      }

      function scrollPage() {
         var sy = scrollY();
         if ($(this).scrollTop() > 150){
            $('#header.header-fixed-top, #header.header-show-hide-on-scroll').addClass("header-filled");
         }
         else{
            $('#header.header-fixed-top, #header.header-show-hide-on-scroll').removeClass("header-filled");
         }
            didScroll = false;
      }

      function scrollY() {
         return window.pageYOffset || docElem.scrollTop;
      }

      init();

   })();


   // Set padding-top to <body> if needed
   // ====================================
   $(window).resize(function() {

      // Make <body> padding-top equal to "#header" height if "#header" contains one of these classes: "header-fixed-top", "header-show-hide-on-scroll".
      if ($('#header').is('.header-fixed-top, .header-show-hide-on-scroll')) {
        $('body').css( 'padding-top', $('#header').css('height'));
      }

      // Set "body" padding-top to "0" if "#header" contains class: "header-transparent".
      if ($('#header').is('.header-transparent')) {
        $('body').css('padding-top', 0);
      }

   }).resize();


	// ===============================
	// Page header
	// ===============================

	// if #page-header exist add class "page-header-on" to <body>.
	if ($('#page-header').length) {
		$('body').addClass('page-header-on');
	}

	// if page header contains background image add class "ph-image-on" to #page-header.
	if ($('.page-header-image').length) {
		$('#page-header').addClass('ph-image-on');
	}

	// if class "hide-ph-image" exist remove class "ph-image-on".
	if ($('.page-header-image').hasClass('hide-ph-image')) {
		$('#page-header').removeClass('ph-image-on');
	}

	// Google map function for getting latitude and longitude
	function getLatLngObject(str, marker, map, callback) {
		var coordinates = {};
		try {
			coordinates = JSON.parse(str);
			callback(new google.maps.LatLng(
				coordinates.lat,
				coordinates.lng
			), marker, map)
		} catch (e) {
			map.geocoder.geocode({'address': str}, function (results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var latitude = results[0].geometry.location.lat();
					var longitude = results[0].geometry.location.lng();

					callback(new google.maps.LatLng(
						parseFloat(latitude),
						parseFloat(longitude)
					), marker, map)
				}
			})
		}
	}

	// Google maps

	if (plugins.maps.length) {
		$.getScript("//maps.google.com/maps/api/js?key=AIzaSyAwH60q5rWrS8bXwpkZwZwhw9Bw0pqKTZM&sensor=false&libraries=geometry,places&v=3.7", function () {
			var head = document.getElementsByTagName('head')[0],
				insertBefore = head.insertBefore;

			head.insertBefore = function (newElement, referenceElement) {
				if (newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') !== -1 || newElement.innerHTML.indexOf('gm-style') !== -1) {
					return;
				}
				insertBefore.call(head, newElement, referenceElement);
			};
			var geocoder = new google.maps.Geocoder;
			for (var i = 0; i < plugins.maps.length; i++) {
				var zoom = parseInt(plugins.maps[i].getAttribute("data-zoom"), 10) || 11;
				var styles = plugins.maps[i].hasAttribute('data-styles') ? JSON.parse(plugins.maps[i].getAttribute("data-styles")) : [];
				var center = plugins.maps[i].getAttribute("data-center") || "New York";

				// Initialize map
				var map = new google.maps.Map(plugins.maps[i].querySelectorAll(".google-map")[0], {
					zoom: zoom,
					styles: styles,
					scrollwheel: false,
					center: {lat: 0, lng: 0}
				});
				// Add map object to map node
				plugins.maps[i].map = map;
				plugins.maps[i].geocoder = geocoder;
				plugins.maps[i].google = google;

				// Get Center coordinates from attribute
				getLatLngObject(center, null, plugins.maps[i], function (location, markerElement, mapElement) {
					mapElement.map.setCenter(location);
				})

				// Add markers from google-map-markers array
				var markerItems = plugins.maps[i].querySelectorAll(".google-map-markers li");

				if (markerItems.length) {
					var markers = [];
					for (var j = 0; j < markerItems.length; j++) {
						var markerElement = markerItems[j];
						getLatLngObject(markerElement.getAttribute("data-location"), markerElement, plugins.maps[i], function (location, markerElement, mapElement) {
							var icon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
							var activeIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active");
							var info = markerElement.getAttribute("data-description") || "";
							var infoWindow = new google.maps.InfoWindow({
								content: info
							});
							markerElement.infoWindow = infoWindow;
							var markerData = {
								position: location,
								map: mapElement.map
							}
							if (icon) {
								markerData.icon = icon;
							}
							var marker = new google.maps.Marker(markerData);
							markerElement.gmarker = marker;
							markers.push({markerElement: markerElement, infoWindow: infoWindow});
							marker.isActive = false;
							// Handle infoWindow close click
							google.maps.event.addListener(infoWindow, 'closeclick', (function (markerElement, mapElement) {
								var markerIcon = null;
								markerElement.gmarker.isActive = false;
								markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon");
								markerElement.gmarker.setIcon(markerIcon);
							}).bind(this, markerElement, mapElement));


							// Set marker active on Click and open infoWindow
							google.maps.event.addListener(marker, 'click', (function (markerElement, mapElement) {
								if (markerElement.infoWindow.getContent().length === 0) return;
								var gMarker, currentMarker = markerElement.gmarker, currentInfoWindow;
								for (var k = 0; k < markers.length; k++) {
									var markerIcon;
									if (markers[k].markerElement === markerElement) {
										currentInfoWindow = markers[k].infoWindow;
									}
									gMarker = markers[k].markerElement.gmarker;
									if (gMarker.isActive && markers[k].markerElement !== markerElement) {
										gMarker.isActive = false;
										markerIcon = markers[k].markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")
										gMarker.setIcon(markerIcon);
										markers[k].infoWindow.close();
									}
								}

								currentMarker.isActive = !currentMarker.isActive;
								if (currentMarker.isActive) {
									if (markerIcon = markerElement.getAttribute("data-icon-active") || mapElement.getAttribute("data-icon-active")) {
										currentMarker.setIcon(markerIcon);
									}

									currentInfoWindow.open(map, marker);
								} else {
									if (markerIcon = markerElement.getAttribute("data-icon") || mapElement.getAttribute("data-icon")) {
										currentMarker.setIcon(markerIcon);
									}
									currentInfoWindow.close();
								}
							}).bind(this, markerElement, mapElement))
						})
					}
				}
			}
		});
	}


	// =======================================================================================
	// Defer videos (Youtube, Vimeo)
	// Note: When you have embed videos in your webpages it causes your page to load slower.
	// Deffering will allow your page to load quickly.
	// Source: https://www.feedthebot.com/pagespeed/defer-videos.html
	// =======================================================================================

	function init() {
	var vidDefer = document.getElementsByTagName('iframe');
	for (var i=0; i<vidDefer.length; i++) {
	if(vidDefer[i].getAttribute('data-src')) {
	vidDefer[i].setAttribute('src',vidDefer[i].getAttribute('data-src'));
	} } }
	window.onload = init;



	// ===================================================================================
	// Isotope
	// Source: http://isotope.metafizzy.co
	// Note: "imagesloaded" blugin is required: https://github.com/desandro/imagesloaded
	// ===================================================================================

	// init Isotope
	var $container = $('.isotope-items-wrap');
	$container.imagesLoaded(function() {
		$container.isotope({
			itemSelector: '.isotope-item',
			transitionDuration: '0.7s',
			masonry: {
				columnWidth: '.grid-sizer',
				horizontalOrder: false
			}
		});
	});

	// Filter
	$('.isotope-filter-links a').on("click",function(){
		var selector = $(this).attr('data-filter');
		$container.isotope({
			filter: selector
		});
		return false;
	});

	// Filter item active
	var filterItemActive = $('.isotope-filter-links a');
	filterItemActive.on('click', function(){
		var $this = $(this);
		if ( !$this.hasClass('active')) {
			filterItemActive.removeClass('active');
			$this.addClass('active');
		}
	});


	// If "isotope-top-content" exist add class ".iso-top-content-on" to <body>.
	if ($('.isotope-top-content').length) {
		$('body').addClass('iso-top-content-on');
	}

	// If ".isotope-filter" contains class "fi-to-button" add class "fi-to-button-on" to ".isotope-top-content".
	if ($('.isotope-filter').hasClass('fi-to-button')) {
		$('.isotope-top-content').addClass('fi-to-button-on');
	}

	// If ".isotope-filter" contains class "fi-to-button" add class "fi-to-button-on" to ".isotope-top-content".
	if ($('.gallery-share').length) {
		$('.isotope-top-content').addClass('gallery-share-on');
	}

	// Filter button clickable/hover (clickable on small screens)
	if ( $(window).width() < 992) {

		// Filter button clickable (effect on small screens)
		$('.isotope-filter-button').on("click",function(){
			$('.isotope-filter').toggleClass('iso-filter-open');
		});

		// Close filter button if click on filter links (effect only on small screens)
		$('ul.isotope-filter-links > li > a').on("click",function() {
			$(".isotope-filter-button").click();
		});

	} else {

		// Filter button on hover
		$('.isotope-filter').on("mouseenter",function(){
			$('.isotope-filter').addClass('iso-filter-open');
		}).on("mouseleave",function(){
			$('.isotope-filter').removeClass('iso-filter-open');
		});

	}


	// if class "isotope" exist.
	if ($('.isotope').length){
		
		// add overflow scroll to <html> (isotope items gaps fix).
		if ( document.querySelector('body').offsetHeight > window.innerHeight ) {
			document.documentElement.style.overflowY = 'scroll';
		}

		// Add class "isotope-on" to <body>.
		$('body').addClass('isotope-on');
	}


	// Add class "iso-gutter-*-on" to <body> if ".isotope" contains class "gutter-*".
	if ($('.isotope').hasClass('gutter-1')) {
		$('body').addClass('iso-gutter-1-on');
	}

	if ($('.isotope').hasClass('gutter-2')) {
		$('body').addClass('iso-gutter-2-on');
	}

	if ($('.isotope').hasClass('gutter-3')) {
		$('body').addClass('iso-gutter-3-on');
	}


	// Add class "iso-tt-wrap-on" to <body> if ".isotope-wrap" contains class "tt-wrap".
	if ($('.isotope-wrap').hasClass('tt-wrap')) {
		$('body').addClass('iso-tt-wrap-on');
	}




	// CC item hover
	$('.cc-item').on('mouseenter',function() {
		$('.owl-carousel').addClass('cc-item-hovered');
	});
	$('.cc-item').on('mouseleave',function() {
		$('.owl-carousel').removeClass('cc-item-hovered');
	});

	// If ".cc-caption" exist add class "cc-caption-on" to ".cc-item".
	$('.cc-item').each(function() {
		if ($(this).find('.cc-caption').length) {
			$(this).addClass('cc-caption-on');
		}
	});






	// =======================================================
	// YTPlayer (Background Youtube video)
	// Source: https://github.com/pupunzi/jquery.mb.YTPlayer
	// =======================================================

	// Disabled on mobile devices, because video background doesn't work on mobile devices (instead the background image is displayed).
	if (!jQuery.browser.mobile) { 
		$(".youtube-bg").mb_YTPlayer();
	}



	// ==============================================================================
	// Add to favorite button
	// Source: http://www.webdesigncrowd.com/demo/circle-reveal-animation-12.23.13/
	// ==============================================================================

	$(".fav-count").on("click",function() {
		var total = parseInt($(this).html(), 10);
		$(this).parent().toggleClass("active");

    if ($(this).parent().hasClass("active")) {
      total += 1;
    } else {
      total -= 1;
    }
    $(this).html(total);
	});

	$(".icon-heart").on("click",function() {
		var total = parseInt($(this).parent().siblings(".fav-count").first().html(), 10);
		if ($(this).parent().parent().hasClass("active")) {
			total -= 1;
		} else {
			total += 1;
		}
		$(this).parent().siblings(".fav-count").first().html(total);
		$(this).parent().parent().toggleClass("active");
	});



 


	// ==================================
	// Fade out element with page scroll
	// ==================================

	$(window).scroll(function(){
		if ($(window).width() > 992) { // disable fade out on small screens
			$(".fade-out-scroll-1").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-2").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-3").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-4").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-5").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-6").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-7").css("opacity", 1 - $(window).scrollTop() / 2000);
			$(".fade-out-scroll-8").css("opacity", 1 - $(window).scrollTop() / 2000);
		}
	});



	// ========================
	// Parallax effect
	// ========================

	$(window).scroll(function(){
		var bgScroll = $(this).scrollTop();

		// parallax - image background position
		$('.parallax-bg-1').css('background-position','center '+ ((bgScroll * 0.1)) +'px');
		$('.parallax-bg-2').css('background-position','center '+ ((bgScroll * 0.1)) +'px');
		$('.parallax-bg-3').css('background-position','center '+ ((bgScroll * 0.1)) +'px');
		$('.parallax-bg-4').css('background-position','center '+ ((bgScroll * 0.1)) +'px');
		$('.parallax-bg-5').css('background-position','center '+ ((bgScroll * 0.1)) +'px');
		$('.parallax-bg-6').css('background-position','center '+ ((bgScroll * 0.1)) +'px');

	});


	$(window).scroll(function(){
		var bgScroll = $(this).scrollTop();
		if ($(window).width() > 992) { // disable parallax on small screens

			// parallax - transform
			$('.parallax-1').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');
			$('.parallax-2').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');
			$('.parallax-3').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');
			$('.parallax-4').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');
			$('.parallax-5').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');
			$('.parallax-6').css('transform', 'translate3d(0, '+ ((bgScroll * 0.1)) +'px, 0)');

			// parallax - top
			// $('.parallax-top').css('top', ''+ ((bgScroll*0.9)) +'px');
		}
	});



	// ==================================
	// Remove input placeholder on focus
	// ==================================

   $('input,textarea').focus(function () {
      $(this).data('placeholder', $(this).attr('placeholder'))
         .attr('placeholder', '');
   }).blur(function () {
      $(this).attr('placeholder', $(this).data('placeholder'));
   });



	// ==================================
	// Albums
	// ==================================

	// Rotate thumb-list items randomly (in gallery-list-carousel)
	$(".thumb-list.tl-rotate > li").each( function() {
		var rNum = (Math.random()*50)-25;  
			$(this).css( {
			'-webkit-transform': 'rotate('+rNum+'2deg)',
			'-moz-transform': 'rotate('+rNum+'2deg)'  
		});  
	});

	/**
	 * @desc Initialize owl carousel plugin
	 * @param {object} c - carousel jQuery object
	 */
	function initOwlCarousel(c) {
		var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-", "-xl-", "-xxl-"],
			values = [0, 480, 576, 768, 992, 1200, 1600],
			responsive = {};

		for (var j = 0; j < values.length; j++) {
			responsive[values[j]] = {};
			for (var k = j; k >= -1; k--) {
				if (!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
					responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
				}
				if (!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
					responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
				}
				if (!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
					responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
				}
			}
		}

		// Enable custom pagination
		if (c.attr('data-dots-custom')) {
			c.on("initialized.owl.carousel", function (event) {
				var carousel = $(event.currentTarget),
					customPag = $(carousel.attr("data-dots-custom")),
					active = 0;

				if (carousel.attr('data-active')) {
					active = parseInt(carousel.attr('data-active'), 10);
				}

				carousel.trigger('to.owl.carousel', [active, 300, true]);
				customPag.find("[data-owl-item='" + active + "']").addClass("active");

				customPag.find("[data-owl-item]").on('click', function (e) {
					e.preventDefault();
					carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
				});

				carousel.on("translate.owl.carousel", function (event) {
					customPag.find(".active").removeClass("active");
					customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
				});
			});
		}

		c.on("initialized.owl.carousel", function () {
			initLightGalleryItem(c.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
		});

		c.owlCarousel({
			autoplay: isNoviBuilder ? false : c.attr("data-autoplay") === "true",
			smartSpeed: c.attr('data-smart-speed') ? c.attr('data-smart-speed') : 250,
			autoplayTimeout: c.attr('data-autoplay-timeout') ? c.attr('data-autoplay-timeout') : 8000,
			loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
			items: 1,
			center: c.attr("data-center") === "true",
			// autoWidth: c.attr("data-autowidth") === "false",
			autoWidth: c.attr("data-autowidth") === "true",
			dotsContainer: c.attr("data-pagination-class") || false,
			navContainer: c.attr("data-navigation-class") || false,
			mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
			nav: c.attr("data-nav") === "true",
			dots: c.attr("data-dots") === "true",
			dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
			animateIn: c.attr('data-animation-in') ? c.attr('data-animation-in') : false,
			animateOut: c.attr('data-animation-out') ? c.attr('data-animation-out') : false,
			responsive: responsive,
			navText: c.attr("data-nav-text") ? $.parseJSON( c.attr("data-nav-text") ) : [],
			navClass: c.attr("data-nav-class") ? $.parseJSON( c.attr("data-nav-class") ) : ['owl-prev', 'owl-next']
		});
	}



	// Owl carousel
	if (plugins.owl.length) {
		for (var i = 0; i < plugins.owl.length; i++) {
			var c = $(plugins.owl[i]);
			plugins.owl[i].owl = c;

			initOwlCarousel(c);

			// Mousewheel plugin
			var owl = $('.owl-mousewheel');
			owl.on('mousewheel', '.owl-stage', function (e) {
				if (e.deltaY > 0) {
					owl.trigger('prev.owl', [800]);
				} else {
					owl.trigger('next.owl', [800]);
				}
				e.preventDefault();
			});
		}
	}

	// =======================
	// RD Navbar
	// =======================
	if (plugins.rdNavbar.length) {
		plugins.rdNavbar.RDNavbar({
			anchorNav: !isNoviBuilder,
			stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
			responsive: {
				0: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false
				},
				768: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false
				},
				992: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false
				},
				1200: {
					stickUp: (!isNoviBuilder) ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false
				}
			},
			callbacks: {
				onStuck: function () {
					var navbarSearch = this.$element.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
					}
				},
				onDropdownOver: function () {
					return !isNoviBuilder;
				},
				onUnstuck: function () {
					if (this.$clone === null)
						return;

					var navbarSearch = this.$clone.find('.rd-search input');

					if (navbarSearch) {
						navbarSearch.val('').trigger('propertychange');
						navbarSearch.trigger('blur');
					}
				}
			}
		});


		if (plugins.rdNavbar.attr("data-body-class")) {
			document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
		}
	}



	// ==================================
	// Single gallery
	// ==================================
	//
	// Gallery single carousel
	// ========================

	// Make carousel info same width as ".gs-carousel-wrap" on small devices
	$(window).resize(function() {
		if ($(window).width() < 768) {
			var gscwWidth = $('.gs-carousel-wrap').width();
			$('.gs-carousel-info').css({
				'width': gscwWidth
			});
		} else {
			$('.gs-carousel-info').css({
				'width': 440
			});
		}
	}).resize();



	// ============================================
	// Limit number of characters/words in element
	// ============================================

	// Limit number of characters in element (example: data-max-characters="120")
	$("div, p, a").each(function() {
		var textMaxChar = $(this).attr('data-max-characters');

		var length = $(this).text().length;
		if(length > textMaxChar) {
			$(this).text($(this).text().substr(0, textMaxChar)+'...');
		}
	});

	// Limit number of words in element (example: data-max-words="40")
	$("div, p, a").each(function() {
		var textMaxWords = $(this).attr('data-max-words');
		var text = $(this).text();

		var length = text.split(' ').length;
		if(length > textMaxWords) {
			var lastWord = text.split(' ')[textMaxWords];
			var lastWordIndex = text.indexOf(lastWord);
				$(this).text(text.substr(0, lastWordIndex) + '...');
		}
	});



	// ======================
	// Footer
	// ======================

	// If "#footer" contains class "footer-minimal" add class "footer-minimal-on" to <body>.
	if ($('#footer').hasClass('footer-minimal')) {
		$('body').addClass('footer-minimal-on');
	}



	// ======================
	// Scroll to top button
	// ======================

	// Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 500) {
			$('.scrolltotop').fadeIn();
		} else {
			$('.scrolltotop').fadeOut();
		}
	});



	// ===============
	// Miscellaneous
	// ===============

	// Bootstrap-3 modal fix
	$('.modal').appendTo("body");


	// Bootstrap tooltip
	$('[data-toggle="tooltip"]').tooltip();


	// Bootstrap popover
	$('[data-toggle="popover"]').popover({
		html: true
	});



	// lightGallery
	if (plugins.lightGallery.length) {
		for (var i = 0; i < plugins.lightGallery.length; i++) {
			initLightGallery(plugins.lightGallery[i]);
		}
	}

	// lightGallery item
	if (plugins.lightGalleryItem.length) {
		for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
			initLightGalleryItem(plugins.lightGalleryItem[i]);
		}
	}

	// Dynamic lightGallery
	if (plugins.lightDynamicGalleryItem.length) {
		for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
			initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
		}
	}
	


})(jQuery); 
