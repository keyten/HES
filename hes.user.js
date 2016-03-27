// ==UserScript==
// @name        HES
// @namespace   http://github.com/keyten/hes
// @description Habrahabr Enhancement Suite
// @include     http://geektimes.ru/*
// @include     http://habrahabr.ru/*
// @include     http://megamozg.ru/*
// @include     https://geektimes.ru/*
// @include     https://habrahabr.ru/*
// @include     https://megamozg.ru/*
// @match       http://geektimes.ru/*
// @match       http://habrahabr.ru/*
// @match       http://megamozg.ru/*
// @match       https://geektimes.ru/*
// @match       https://habrahabr.ru/*
// @match       https://megamozg.ru/*
// @exclude     %exclude%
// @author      HabraCommunity
// @version     1.1.2
// @grant       none
// @run-at      document-start
// ==/UserScript==

// Настройки
// Авторы, посты которых скрываем
(function (window) {

	var ajax = function (url, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				callback(xhttp.responseText);
			}
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}

	var config = {
		hidePosts: {
			enabled: true,
			authors: [
				'alizar',
				'marks',
				'ivansychev',
				'ragequit',
				'SLY_G'
			],
			hubs: [
				'mvideo',
				'icover',
				'gearbest'
			],
			mode: 'hideContent'
		},
		mathjax: true,

		nightMode: false,

		hideUserInfo: false, // скрывать "плашки", появл. при наведении на ник пользователя

		replaceLinks: true // замена ссылок в комментариях от пользователей с низкой кармой на кликабельные
	};

	// подгружаем настройки из localStorage
	var updateLSConfig = function () {
		return localStorage.setItem('us_config', JSON.stringify(config));
	}
	var citem;
	if (citem = localStorage.getItem('us_config')) {
		citem = JSON.parse(citem);
		extend(config, citem)
	}
	else updateLSConfig()

	// ивертируем прозрачные изображения с тёмным контентом
	var invertTransparentDarkImages = function () {
		delayedStart(function () {return window['$']}, function () {
			var _process = function () {
				$('.content img[src]').each(function () {
					var $el = $(this);
					resemble($el.attr('src').replace('habrastorage', 'hsto').replace(/^\/\//, 'https://')).onComplete(function (data) {
						if (data.brightness < 10 && data.alpha > 70) {
							$el.addClass('image-inverted')
						}
					})
				})
			}

			if (window['resemble']) {
				return _process()
			}

			$.getScript('https://rawgit.com/extempl/Resemble.js/master/resemble.js', function () {
				delayedStart(function() {return window['resemble']}, _process)
			})
		})
	}

	var nmInterval;

	var setNightMode = function () {
		var styles;
		var s = document.createElement('style');
		s.id = 'us_nmstyle';
		document.head.appendChild(s);

		if (styles = localStorage.getItem('us_nmstyle')) {
			s.textContent = styles;
		}

		ajax('https://rawgit.com/WaveCutz/habrahabr.ru_night-mode/master/userstyle.css', function (data) {
			localStorage.setItem('us_nmstyle', data);
			s.textContent = data;
		});

		nmInterval = setInterval(function () {
			$('head').append($('#us_nmstyle'))
		}, 300)

		invertTransparentDarkImages()
	}

	if (config.nightMode) {
		setNightMode()
	}

	// regExp: https://gist.github.com/dperini/729294
	var link_reg = /((?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?)/gi
	var template = '<a href="$1" target="_blank" class="unchecked_link" title="Непроверенная ссылка">$1</a>'

	var replaceLinks = function ($comments) {
		$comments.each(function (i, comment) {
			var depth = 5 // максимальная глубина вложенности
			var _seekAndReplace = function (node, depth) {
				if (!--depth) return;
				Array.prototype.forEach.call(node.childNodes, function (node) {
					if (node.nodeType == 3) { // если текст - искать/заменять
						var $node = $(node)
						if (!$node.parent('a').length) { // если родитель не ссылка
							if (link_reg.test(node.nodeValue)) {
								$node.replaceWith(node.nodeValue.replace(link_reg, template))
							}
						}
					} else if (node.nodeType == 1) { // если элемент - рекурсивно обходим текстовые ноды
						_seekAndReplace(node, depth)
					}
				})
			}


			_seekAndReplace(comment, depth)
		})
	}

	var replaceAllLinks = function () {
		$('head').append('<style id="unchecked_links">' +
			'.html_format.message  a.unchecked_link, ' +
			'.html_format.message  a.unchecked_link:visited { ' +
			'  color: darkred; ' +
			'}</style>')
		replaceLinks($('.comment-item + .message'))
	}
	var replaceNewLinks = function () {
		replaceLinks($('.comment-item.is_new + .message'))
	}

	window.addEventListener('load', function () {
		var $ = window.jQuery;

		$('#xpanel').children('.refresh').click(function () {
			var $el = $(this)

			setTimeout(delayedStart.bind(this, function () {return !$el.hasClass('loading')}, function () {
				$(document).trigger('comments.reloaded')
			}), 100)
		})

		$(function () {

			// скрываем авторов
			if (config.hidePosts.enabled
				&& config.hidePosts.authors.length > 0) {
				$('.posts .post').each(function () {
					var author = trim($('.post-author__link', this).text());
					author = author.substr(1);
					console.log(author);
					if (config.hidePosts.authors.indexOf(author) > -1) {
						if (config.hidePosts.mode == 'hideContent')
							$('.hubs, .content', this).hide();
						else
							$(this).remove();
					}
				});
			}

			// скрываем посты из хабов
			if (config.hidePosts.enabled
				&& config.hidePosts.hubs
				&& config.hidePosts.hubs.length > 0) {
				$('.posts .post').each(function() {
					var pHubNames = $('.hub', this).map(getName).get();
					var mpHubNames = $('.profile', $('.megapost-head__hubs', this).get())
										.map(getName).get();
					var hubNames = pHubNames.concat(mpHubNames);
					var banned = hubNames.filter(function(value){
						return config.hidePosts.hubs.indexOf(value) > -1;
					});
					if(banned.length > 0) {
						console.log(banned.join(', '));
						if(config.hidePosts.mode == 'hideContent'){
							$('.hubs, .content', this).hide();
						} else {
							$(this).remove();
						}
					}
				});
			}

			if (config.nightMode) {
				clearInterval(nmInterval);
				nmInterval = null;
			}

			// красивые формулы
			if (config.mathjax) {
				var id = 0;
				// заменяем картинки на формулы
				$('img[src^="http://tex.s2cms.ru/svg/"], img[src^="https://tex.s2cms.ru/svg/"]').each(function () {

					var $this = $(this);

					// парсим код
					var decodedURL = decodeURIComponent(this.src)
					var code = decodedURL.replace(/^https?:\/\/tex\.s2cms\.ru\/svg\/(\\inline)?/, '');

					// создаём объект для TeX-формулы
					var span = $('<span></span>');

					// проверяем, использовать $ или $$
					if (!this.id)
						this.id = 'texImage' + (id++);

					if ($('div[style="text-align:center;"] > #' + this.id).length > 0) {
						span.text('$$tex' + code + '$$');
					}
					else {
						span.text('$tex' + code + '$');
					}


					// скрываем картинку и выводим TeX
					$this.after(span)
					$this.hide();
				});

				// подключаем mathjax
				var v = document.createElement('script');
				v.type = 'text/x-mathjax-config';
				v.textContent = "MathJax.Hub.Config({tex2jax:{inlineMath:[['$tex','$']],displayMath:[['$$tex','$$']]},asciimath2jax:{delimiters:[['$asc','$']]}});\
				MathJax.Hub.Register.MessageHook('TeX Jax - parse error',function (message) {var $span = $(message[4]).parent(); $span.prev('img').show(); $span.remove()});";
				var s = document.createElement('script');
				s.src = '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML&locale=ru';
				document.head.appendChild(v);
				document.head.appendChild(s);
			}

			// скрываем плашки с именем-кармой-etc юзера
			if (config.hideUserInfo) {
				$('*[rel=user-popover]').webuiPopover('destroy');
			}

			if (config.replaceLinks) {
				replaceAllLinks()
				$(document).on('comments.reloaded', replaceNewLinks)
			}

			// добавляем менюшку с конфигом
			{
				var $tab = $('#settings_tab');
				var $menu = $('<div class="menu"></div>');
				$tab.append('<div class="title">HES</div>');
				$tab.append($menu);

				var $he_button = $('<a href="javascript://"></a>');
				if (!config.hidePosts.enabled)
					$he_button.text('Скрывать посты: off');
				else if (config.hidePosts.mode == 'hideContent')
					$he_button.text('Скрывать частично');
				else
					$he_button.text('Скрывать посты: on');
				$he_button.click(function () {
					if (!config.hidePosts.enabled) {
						config.hidePosts.enabled = true;
						config.hidePosts.mode = 'hide';
						$he_button.text('Скрывать посты: on');
					}
					else if (config.hidePosts.mode == 'hideContent') {
						config.hidePosts.enabled = false;
						$he_button.text('Скрывать посты: off');
					}
					else {
						config.hidePosts.enabled = true;
						config.hidePosts.mode = 'hideContent';
						$he_button.text('Скрывать частично');
					}
					updateLSConfig()
				});
				$he_button.appendTo($menu);

				var $ha_button = $('<a href="javascript://">Скрываемые авторы</a>');
				$ha_button.click(function () {
					var list = (config.hidePosts.authors || []).join(', ')
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					if (!auth)
						return;
					config.hidePosts.authors = auth.replace(/\s/g, '').split(',');
					updateLSConfig()
				});
				$ha_button.appendTo($menu);

				var $hh_button = $('<a href="javascript://">Скрываемые хабы</a>');
				$hh_button.click(function () {
					var list = (config.hidePosts.hubs || []).join(', ');
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					if (!auth)
						return;
					config.hidePosts.hubs = auth.replace(/\s/g, '').split(',');
					updateLSConfig()
				});
				$hh_button.appendTo($menu);

				var $mj_button = $('<a href="javascript://">MathJax: <span>' + (config.mathjax ? 'on' : 'off') + '</span></a>');
				$mj_button.click(function () {
					var $state = $(this).children('span')
					if (config.mathjax) {
						config.mathjax = false;
						$state.text('off')
					}
					else {
						config.mathjax = true;
						$state.text('on')
					}
					updateLSConfig()
				});
				$mj_button.appendTo($menu);

				var $nm_button = $('<a href="javascript://">Night mode: <span>' + (config.nightMode ? 'on' : 'off') + '</span></a>');
				$nm_button.click(function () {
					var $state = $(this).children('span')
					if (config.nightMode) {
						config.nightMode = false;
						$state.text('off')
						var s = document.getElementById('us_nmstyle');
						if (s)
							document.head.removeChild(s);
					}
					else {
						config.nightMode = true;
						$state.text('on')
						setNightMode()
					}
					updateLSConfig()
				});
				$nm_button.appendTo($menu);

				// Hide user info. Аббревиатуру не делать.
				var $h_button = $('<a href="javascript://">Скрывать юзеринфо: <span>' + (config.hideUserInfo ? 'on' : 'off') + '</span></a>');
				$h_button.click(function () {
					var $state = $(this).children('span')
					if (config.hideUserInfo) {
						config.hideUserInfo = false;
						$state.text('off')
					}
					else {
						config.hideUserInfo = true;
						$state.text('on')
					}
					updateLSConfig()
				});
				$h_button.appendTo($menu);


				var $l_button = $('<a href="javascript://">Кликабельные ссылки: <span>' + (config.replaceLinks ? 'on' : 'off') + '</span></a>');
				$l_button.click(function () {
					var $state = $(this).children('span')
					if (config.replaceLinks) {
						config.replaceLinks = false
						$state.text('off')
						$('style#unchecked_links').remove()
						$(document).off('comments.reloaded', replaceNewLinks)
					}
					else {
						config.replaceLinks = true
						$state.text('on')
						replaceAllLinks()
						$(document).on('comments.reloaded', replaceNewLinks)
					}
					updateLSConfig()
				})
				$l_button.appendTo($menu);
			}
		})
	});

	function trim(str) {
		return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	function getName() {
		return $(this).attr("href").split("/")[4];
	}

	// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
	function extend(destination, source) {
		for (var property in source) {
			if(!source.hasOwnProperty(property)) continue;
			if (source[property] && source[property].constructor &&
				source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	}

	function delayedStart(expr, callback) {
		if (!expr()) {
			return setTimeout(delayedStart.bind(this, expr, callback), 100)
		}
		callback()
	}

})(window);
