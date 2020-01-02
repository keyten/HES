// ==UserScript==
// @name        HES
// @namespace   http://github.com/keyten/hes
// @description Habrahabr Enhancement Suite
// @include     https://habr.com/*
// @match       https://habr.com/*
// @exclude     %exclude%
// @author      HabraCommunity
// @version     2.6.20
// @grant       none
// @run-at      document-start
// ==/UserScript==

/*
 modules.module = {
   config: {state: string, default state: 'on', 'off', custom}
   scriptLoaded: function
   documentLoaded: function, on document load
   commentsReloaded: function, on comments reloaded
   button: {
     text: string
     states: {
       on: function, fires when setting is triggered on
       off: function, fires when setting is triggered off
       custom
     }
   }
 }
 */

(function (window) {
	"use strict"
	const postsListSelector = '.content-list_posts';
	const postsSelector = `${postsListSelector} .post`

	const helper = {
		get $postsList() {
			return $(postsListSelector)
		},
		get $posts() {
			return $(postsSelector)
		}
	}

	const getName = function (i, el) {
		const pathParts = el.getAttribute("href").split("/");
		return pathParts[pathParts.length - 2]
	}

	const version = '2.6.20';

	// modules describe
	const modules = {}
	modules.hidePosts = {
		config: {
			state: 'partially',
			onClass: 'hes-hide',
			partiallyClass: 'hes-hide-partially'
		},
		documentLoaded: function () {
			this.button.states[this.config.state].call(this)
		},
		button: {
			text: 'Hide posts',
			states: {
				on: function () {
					this.button.states.off.call(this);
					helper.$postsList.addClass(this.config.onClass)
				},
				off: function () {
					helper.$postsList.removeClass(`${this.config.onClass} ${this.config.partiallyClass}`)
				},
				partially: function () {
					this.button.states.off.call(this);
					helper.$postsList.addClass(this.config.partiallyClass)
				}
			}
		}
	}

	modules.hideImgs = {
		config: {
			state: 'off',
			onClass: 'hes-hide-img'
		},
		documentLoaded: function () {
			this.button.states[this.config.state].call(this)
		},
		button: {
			text: 'Hide images',
			states: {
				on: function () {
					this.button.states.off.call(this);
					helper.$postsList.addClass(this.config.onClass)
				},
				off: function () {
					helper.$postsList.removeClass(this.config.onClass)
				}
			}
		}
	}

	modules.hideAuthors = {
		config: {
			list: [
				'alizar',
				'marks',
				'ivansychev',
				'ragequit',
				'SLY_G'
			],
			hidePostClass: 'hes-hide-post-a'
		},
		documentLoaded: function () {
			if (!(this.config.list || []).length) return;

			this.updatePosts();
		},
		updatePosts: function () {
			helper.$posts.removeClass(this.config.hidePostClass).filter((i, el) => {
				const author = $('.user-info__nickname', el).text();
				return this.config.list.includes(author);
			}).addClass(this.config.hidePostClass);
		},
		button: {
			text: 'Hide authors',
			states: {
				on: function () {
					const list = (this.config.list || []).join(', ');
					const authors = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					this.config.list = (authors || '').replace(/\s/g, '').split(',');
					this.updatePosts();
				}
			}
		}
	}

	modules.hideHubs = {
		config: {
			list: [
				'mvideo',
				'icover',
				'gearbest'
			],
			hidePostClass: 'hes-hide-post-h'
		},
		documentLoaded: function () {
			if (!(this.config.list || []).length) return;

			this.updatePosts();
		},
		updatePosts: function () {
			helper.$posts.removeClass(this.config.hidePostClass).filter((i, el) => {
				const hubNames = $('.hub-link, .preview-data__hubs .list__item-link', el).map(getName).get()
				return this.config.list.some(hub => hubNames.includes(hub))
			}).addClass(this.config.hidePostClass);
		},
		button: {
			text: 'Hide hubs',
			states: {
				on: function () {
					const list = (this.config.list || []).join(', ');
					const hubs = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					this.config.list = (hubs || '').replace(/\s/g, '').split(',');
					this.updatePosts();
				}
			}
		}
	}

	// TODO check native support for old posts like this https://habr.com/ru/post/261803/
	modules.mathjax = {
		config: {state: 'on'},

		replaceTeX: function (base) {
			$(base || '.post__body_full').find('img[src*="//tex.s2cms.ru/"], img[src*="//latex.codecogs.com/"]').filter(':visible')
				.each(function () {

					var $this = $(this);

					// парсим код
					var decodedURL = decodeURIComponent(this.src);
					var code = decodedURL.replace(/^https?:\/\/tex\.s2cms\.ru\/(svg|png)\/(\\inline)?/, '')
						.replace(/^https?:\/\/latex\.codecogs\.com\/gif\.latex\?(\\dpi\{\d+\})?/, '')
						.replace(/\\(right|left)\s([\[\{\]\}(|)])/g, "\\$1$2") // мерджим ошибочные резделители
						.replace(/\\(right|left)\s/g, '') // игнорируем пустые разделители

					// проверяем, использовать $ или $$
					code = '$tex' + code + '$';
					if ($this.parent().is('div[style="text-align:center;"]') || $this.prev().is('br')) {
						code = '$' + code + '$';
					}

					// скрываем картинку и выводим TeX
					$this.hide().after('<span>' + code + '</span>')
				});
			// $.getScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js?config=TeX-MML-AM_CHTML&locale=ru')
		},

		scriptLoaded: function () {

		},

		documentLoaded: function () {
			// подключаем mathjax
			if (!$('[type="text/x-mathjax-config"]').length) {
				$("<script type=\"text/x-mathjax-config\"> \
					MathJax.Hub.Config({ \
						tex2jax:{ \
							inlineMath:[['$tex','$']], \
							displayMath:[['$$tex','$$']] \
						}, \
						asciimath2jax:{delimiters:[['$asc','$']]} \
					}); \
					MathJax.Hub.Register.MessageHook('TeX Jax - parse error', function (message) { \
						console.error(message); \
						var $span = $(message[4]).parent(); \
						$span.prev('img').show(); \
						$span.remove() \
					}); \
				</script>").appendTo('head')
			}

			// заменяем картинки на формулы
			this.replaceTeX()
		},

		commentsReloaded: function () {
			this.replaceTeX('.comment-item.is_new + .message')
		},
		button: {
			text: 'MathJax',
			states: {
				on: function () {
					this.documentLoaded()
				},
				off: null
			}
		}
	}

	modules.nightMode = {
		config: {
			state: 'off',
			id: 'hes_nmstyle',
			styleUri: 'https://rawgit.com/WaveCutz/habrahabr.ru_night-mode/master/source.css'
		},
		scriptLoaded: function () {
			let styles;
			const s = document.createElement('style');
			s.id = this.config.id;
			s.setAttribute('media', 'screen');
			const layout = document.querySelector('.layout')
			if (layout) {
				document.body.insertBefore(s, layout)
			} else {
				(document.body || document.head).appendChild(s)
			}

			if (styles = localStorage.getItem(this.config.id)) {
				s.textContent = styles;
			}

			ajax(this.config.styleUri, data => {
				localStorage.setItem(this.config.id, data);
				s.textContent = data;
			});

			this.nmInterval = setInterval(function () {
				const layout = document.querySelector('.layout')
				if (layout) {
					document.body.insertBefore(s, layout)
				}
			}, 200)
		},
		documentLoaded: function () {
			if (this.nmInterval) {
				clearInterval(this.nmInterval);
				this.nmInterval = null;
			}
		},
		button: {
			text: 'Night mode',
			states: {
				on: function () {
					this.scriptLoaded()
					this.documentLoaded()
				},
				off: function () {
					$(`style#${this.config.id}`).remove()
				}
			}
		}
	}

	modules.invertImages = {
		config: {state: 'off', scriptUri: 'https://rawgit.com/extempl/Resemble.js/master/resemble.js'},
		documentLoaded: function () {
			if (this.nmInterval) {
				clearInterval(this.nmInterval);
				this.nmInterval = null;
			}

			const _process = function () {
				$('.comment__message img[src], .post__text img[src]').each(function () {
					const $el = $(this);

					if ($el.is('[src*="latex.codecogs.com"], [src*="tex.s2cms.ru"]')) {
						return $el.addClass('image-inverted')
					}

					if (config.invertImages.state === 'on') {
						const $wrapper = $('<div class="image-wrapper" />')
						const link = $el.wrap($wrapper).attr('src')
							.replace('habrastorage', 'hsto').replace(/^\/\//, 'https://')

						$el.parent().css('float', $el.css('float'))

						$el.after('<span class="inverse-toggle">◐</span>')

						resemble(link).onComplete(function (data) {
							if (data.brightness < 10 && data.alpha > 60 ||
								data.brightness < 6 && data.alpha > 30 ||
								data.brightness < 1 ||
								data.brightness > 87 && data.white > 60) {
								$el.addClass('image-inverted')
							}
						})
					}
				})
			}

			if (window['resemble']) {
				return _process()
			}

			$.getScript(this.config.scriptUri, function () {
				delayedStart(() => (window['resemble']), _process)
			})

			$(document).off('click', '.inverse-toggle')
				.on('click', '.inverse-toggle', function (e) {
					e.preventDefault()
					$(e.target).prev('img').toggleClass('image-inverted')
				})
		},
		button: {
			text: 'Invert images',
			states: {
				on: function () {
					this.documentLoaded()
				},
				off: function () {
					$('.image-wrapper').each(function (i, imageWrapper) {
						const $imageWrapper = $(imageWrapper);
						$imageWrapper.replaceWith($imageWrapper.children('img'))
					})
					const $inverted = $('.image-inverted')
					if ($inverted.length) {
						$inverted.removeClass('image-inverted')
						return
					}
				},
			}
		}
	}

	modules.liveLinksPreview = {
		config: {state: 'on'},
		loadLink: function (i, link) {
			const $link = $(link)
			let url;
			try {
				url = new URL($link.attr('href'))
			} catch (e) {
				console.error($link)
				return
			}
			url.protocol = 'https';
			if (['geektimes.ru', 'habrahabr.ru'].includes(url.host)) {
				url.host = 'habr.com'
			}
			fetch(url).then(xhr => xhr.text()).then(function (str) {
				const $html = (new window.DOMParser()).parseFromString(str, "text/html");
				const $head = $($html.querySelector('head'));

				const title = $head.find('meta[property="og:title"]').attr('content');
				const description = $head.find('meta[property="og:description"]').attr('content');
				const image = $head.find('meta[property="og:image"]').first().attr('content');

				// const json = JSON.parse($head.querySelector('script[type="application/ld+json"]').textContent);

				if (title) {
					$link.attr('data-title', title);
					$link.attr('data-description', description);
					$link.attr('data-image', image);

					$link.text(title);
				}

				$link.addClass('preview-processed')
			})
		},
		loadLinks: function (base, filter = () => true) {
			const $base = $(base || '.post__body_full')
			let $links = $base.find('a');
			$links = $links.filter(':not([href^="#"]):not([href=""])')
			switch (this.config.state) {
				case 'on':
					$links = $links.filter((i, link) => $(link).text().length)
				case 'force':
					$links = $links.filter('[href^="http://habr"], [href^="https://habr"]')
					break;
				case 'all':
					$links = $links.filter((i, link) => $(link).text().length)
				case 'force_all':
			}
			$links.not('.preview-processed').each(this.loadLink)
		},
		previewLink: function (link) {
			// TODO popup with preview on hover - add as a separated module
		},
		documentLoaded: function () {
			this.loadLinks();
			this.loadLinks('.comment_message');
		},
		commentsRealoded: function () {
			this.loadLinks('.comment_message');
		},
		button: {
			text: 'Preview Links',
			states: {
				on: function () { // заменять текст на title если текст не установлен (ссылка)
					this.documentLoaded()
				},
				force: function () {// заменять любой текст на title
					this.documentLoaded()
				},
				all: function () { // для всех ссылок
					this.documentLoaded()
				},
				force_all: function () {
					this.documentLoaded()
				},
				off: null
			}
		}
	}

	modules.hideUserInfo = {
		config: {state: 'off'},
		documentLoaded: function () {
			$('*[rel=user-popover]').webuiPopover('destroy');
		},
		button: {
			text: 'Hide UserInfo',
			states: {
				on: function () {
					this.documentLoaded()
				},
				off: null
			}
		}
	}

	modules.timeForReading = {
		config: {state: 'on', scriptUri: 'https://rawgit.com/michael-lynch/reading-time/master/src/readingtime.js'},
		documentLoaded: function () {

			const $article = $('.post__body_full')

			const _process = function () {
				$article.readingTime({lang: 'ru'})
			}

			$article.prepend('<div style="float:right">🕝 <span class="eta" /> на прочтение</div>')
			$article.css('margin-top', '-1em')
			$article.find('.post__text').css('clear', 'both')

			$.getScript(this.config.scriptUri, _process)
		},
		button: {
			text: 'Time to read',
			states: {
				on: function () {
					this.documentLoaded()
				},
				off: null
			}
		}
	}

	//======================================================================================
	// main config
	const config = {}

	Object.keys(modules).forEach(key => {
		config[key] = modules[key].config;
	});

	// main logic

	// подгружаем настройки из localStorage
	const updateLSConfig = function () {
		return localStorage.setItem('hes_config', JSON.stringify(config));
	}
	let citem;
	if (citem = localStorage.getItem('hes_config')) {
		citem = JSON.parse(citem);
		extend(config, citem);
	} else updateLSConfig()

	// initial start
	Object.keys(modules).forEach(key => {
		const module = modules[key];
		if (['on', 'partially'].includes(config[key].state)) {
			(module.scriptLoaded || _f).call(module)
		}
	})

	delayedStart(function () {
		return document.querySelectorAll('.main-navbar__section_right .dropdown_user, .main-navbar__section_right .btn_navbar_registration').length;
	}, () => {
		const dropdownUser = document.querySelector('.main-navbar__section_right .dropdown_user');
		const dropdown = document.createElement('div');
		dropdown.className = 'dropdown dropdown_hes';
		const dropdownHTML = '\
		<button type="button" class="btn btn_x-large btn_navbar_hes-dropdown" \
				data-toggle="dropdown" aria-haspopup="true" role="button" \
				aria-expanded="false" tabindex="0" title="Version: ' + version + '">HES</button> \
		<div class="dropdown-container dropdown-container_white" aria-hidden="true" role="menu"> \
			<ul class="n-dropdown-menu n-dropdown-menu_hes"></ul> \
		</div> \
	';
		dropdown.innerHTML = dropdownHTML;
		const rightMenu = document.querySelector('.main-navbar__section_right');

		if (dropdownUser) {
			rightMenu.insertBefore(dropdown, dropdownUser)
		} else {
			rightMenu.appendChild(dropdown)
		}
	})

	window.addEventListener('load', delayedStart.bind(this, function () {
		return window.jQuery
	}, function () {
		const $ = window.jQuery;
		$(function () {

			// load main styles
			ajax('https://rawgit.com/keyten/HES/master/style.css', function (data) {
				const $s = $('<style id="hes_mainstyles"></style>')
				$s.text(data).appendTo('head');
			});

			const $menu = $('.n-dropdown-menu_hes');

			// main

			$('#xpanel').children('.refresh').click(function () {
				const $el = $(this)

				setTimeout(delayedStart.bind(this, function () {
					return !$el.hasClass('loading')
				}, function () {
					$(document).trigger('comments.reloaded')
				}), 300)
			})

			Object.keys(modules).forEach(function (key) {
				const module = modules[key];
				const states = Object.keys(module.button.states)

				const state = config[key].state || states[0];
				if (state !== 'off') {
					// document loaded start
					(module.documentLoaded || _f).call(module);

					// comments reloaded event subscription
					if (module.commentsReloaded) {
						$(document).on('comments.reloaded', module.commentsReloaded.bind(module))
					}
				}

				if (!(states || []).length) return; // There is no buttons for module

				const $menuItem = $('<li class="n-dropdown-menu__item" />');
				const $button = $('<a href="#" class="n-dropdown-menu__item-link">' + module.button.text + '</a>');
				$menuItem.append($button);
				if (states.length > 1) $button.attr('data-state', state);

				$button.click(function () {
					const stateIndex = states.indexOf(config[key].state);
					const newState = states[stateIndex + 1] || states[0];
					if (states.length > 1) $(this).attr('data-state', newState);
					config[key].state = newState;
					const stateMethod = module.button.states[newState];
					(stateMethod && stateMethod.bind(module) || _f)()
					updateLSConfig();
					if (module.commentsReloaded) {
						$(document)[newState]('comments.reloaded', module.commentsReloaded.bind(module))
					}
				});
				$menu.append($menuItem);
			})
		})
	}))
})(window)


// Utils

function ajax(url, callback) {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callback(xhttp.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
function extend(destination, source) {
	for (const property in source) {
		if (!source.hasOwnProperty(property)) continue;
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

function _f() {
}
