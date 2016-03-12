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
// @version     1
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
			'hubs': [
				'mvideo',
				'icover',
				'gearbest'
			],
			mode: 'hideContent'
		},
		mathjax: true,

		nightMode: false,

		hideUserInfo: false // скрывать "плашки", появл. при наведении на ник пользователя
	};

	// подгружаем настройки из localStorage
	var citem;
	if (citem = localStorage.getItem('us_config')) {
		citem = JSON.parse(citem);
		for (var key in citem) {
			if (!Object.prototype.hasOwnProperty.call(citem, key))
				continue;
			config[key] = citem[key];
		}
	}
	else {
		localStorage.setItem('us_config', JSON.stringify(config));
	}

	var setNightMode = function () {
		var styles;
		var s = document.createElement('style');
		s.id = 'us_nmstyle';
		document.head.appendChild(s);

		if (styles = localStorage.getItem('us_nmstyle')) {
			s.textContent = styles;
		}

		ajax('https://raw.githubusercontent.com/WaveCutz/habrahabr.ru_night-mode/master/userstyle.css', function (data) {
			localStorage.setItem('us_nmstyle', data);
			s.textContent = data;
		});
	}

	if (config.nightMode) {
		setNightMode()
	}

	window.addEventListener('load', function () {
		var $ = window.jQuery;

		$(function () {

			// скрываем авторов
			if (config.hidePosts.enabled
				&& config.hidePosts.authors.length > 0) {
				$('.post').each(function () {
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
				$('.post').each(function() {
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

			// красивые формулы
			if (config.mathjax) {
				var id = 0;
				// заменяем картинки на формулы
				$('img[src^="https://tex.s2cms.ru/svg/"]').each(function () {

					var $this = $(this);

					// парсим код
					var code = this.src.replace(/^https:\/\/tex\.s2cms\.ru\/svg/, '');
					code = code.substr(1);
					code = unescape(code);

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
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$he_button.appendTo($menu);

				var $ha_button = $('<a href="javascript://">Скрываемые авторы</a>');
				$ha_button.click(function () {
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', config.hidePosts.authors.join(', '));
					if (!auth)
						return;
					config.hidePosts.authors = auth.replace(/\s/g, '').split(',');
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$ha_button.appendTo($menu);

				var $hh_button = $('<a href="javascript://">Скрываемые хабы</a>');
				$hh_button.click(function () {
					var text = config.hidePosts.hubs ? config.hidePosts.hubs.join(', '): "";
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', text);
					if (!auth)
						return;
					config.hidePosts.hubs = auth.replace(/\s/g, '').split(',');
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$hh_button.appendTo($menu);

				var $mj_button = $('<a href="javascript://">MathJax: ' + (config.mathjax ? 'on' : 'off') + '</a>');
				$mj_button.click(function () {
					if (config.mathjax) {
						config.mathjax = false;
						$mj_button.text('MathJax: off');
					}
					else {
						config.mathjax = true;
						$mj_button.text('MathJax: on');
					}
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$mj_button.appendTo($menu);

				var $nm_button = $('<a href="javascript://">Night mode: ' + (config.nightMode ? 'on' : 'off') + '</a>');
				$nm_button.click(function () {
					if (config.nightMode) {
						config.nightMode = false;
						$nm_button.text('Night mode: off');
						var s = document.getElementById('us_nmstyle');
						if (s)
							document.head.removeChild(s);
					}
					else {
						config.nightMode = true;
						$nm_button.text('Night mode: on');
						setNightMode()
					}
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$nm_button.appendTo($menu);

				// Hide user info. Аббревиатуру не делать.
				var $h_button = $('<a href="javascript://">Скрывать юзеринфо: ' + (config.hideUserInfo ? 'on' : 'off') + '</a>');
				$h_button.click(function () {
					if (config.hideUserInfo) {
						config.hideUserInfo = false;
						$h_button.text('Скрывать юзеринфо: off');
					}
					else {
						config.hideUserInfo = true;
						$h_button.text('Скрывать юзеринфо: on');
					}
					localStorage.setItem('us_config', JSON.stringify(config));
				});
				$h_button.appendTo($menu);

			}
		})
	});

	function trim(str) {
		return str.replace(/^\s*/, '').replace(/\s*$/, '');
	}

	function getName() {
		return $(this).attr("href").split("/")[4];
	};
})(window);
