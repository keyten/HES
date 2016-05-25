// ==UserScript==
// @name        HES
// @namespace   http://github.com/keyten/hes
// @description Habrahabr Enhancement Suite
// @include     http://geektimes.ru/*
// @include     http://habrahabr.ru/*
// @include     https://geektimes.ru/*
// @include     https://habrahabr.ru/*
// @match       http://geektimes.ru/*
// @match       http://habrahabr.ru/*
// @match       https://geektimes.ru/*
// @match       https://habrahabr.ru/*
// @exclude     %exclude%
// @author      HabraCommunity
// @version     2.2.2
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

	var version = '2.2.1';

	// modules describe
	var modules = {}
	modules.hidePosts = {
		config: {state: 'partially'},
		documentLoaded: function () {
			this.button.states[this.config.state].call(this)
		},
		button: {
			text: 'Hide posts',
			states: {
				on: function () {
					this.button.states.off();
					$('.posts').addClass('hide')
				},
				off: function () {
					$('.posts').removeClass('hide hide-partially')
				},
				partially: function () {
					this.button.states.off();
					$('.posts').addClass('hide-partially')
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
			]
		},
		documentLoaded: function () {
			if (!(config.hideAuthors.list || []).length) return;

			this.updatePosts();
		},
		updatePosts: function () {
			$('.posts .post').removeClass('hide-post-a').filter(function () {
				var author = trim($('.post-author__link', this).text()).substr(1);
				return ~config.hideAuthors.list.indexOf(author);
			}).addClass('hide-post-a');
		},
		button: {
			text: 'Hide authors',
			states: {
				on: function () {
					var list = (config.hideAuthors.list || []).join(', ');
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					if (auth == null)
						return;
					config.hideAuthors.list = auth.replace(/\s/g, '').split(',');
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
			]
		},
		getName: function () {
			return $(this).attr("href").split("/")[4];
		},
		documentLoaded: function () {
			if (!(config.hideHubs.list || []).length) return;

			this.updatePosts();
		},
		updatePosts: function () {
			var module = this;

			$('.posts .post').removeClass('hide-post-h').filter(function () {
				var hubNames = $('.hub, .megapost-head__hubs .list__item-link', this).map(module.getName).get()
				return config.hideHubs.list.some(function (hub) {
					return ~hubNames.indexOf(hub)
				})
			}).addClass('hide-post-h');
		},
		button: {
			text: 'Hide hubs',
			states: {
				on: function () {
					var list = (config.hideHubs.list || []).join(', ');
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					if (!auth)
						return;
					config.hideHubs.list = auth.replace(/\s/g, '').split(',');
					this.updatePosts();
				}
			}
		}
	}

	modules.hideFlows = {
		config: {
			list: [
				'marketing',
				'management'
			]
		},
		getName: function () {
			return this.length && $(this).attr("href").split("/")[4];
		},
		documentLoaded: function () {
			if (!(config.hideFlows.list || []).length) return;

			this.updatePosts();
		},
		updatePosts: function () {
			var module = this

			$('.posts .post').removeClass('hide-post-f').filter(function () {

				var flow = module.getName.call($(this).find('.post__flow'))
				return ~config.hideFlows.list.indexOf(flow);
			}).addClass('hide-post-f');
		},
		button: {
			text: 'Hide flows',
			states: {
				on: function () {
					var list = (config.hideFlows.list || []).join(', ');
					var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
					if (auth == null)
						return;
					config.hideFlows.list = auth.replace(/\s/g, '').split(',');
					this.updatePosts();
				}
			}
		}
	}

	modules.mathjax = {
		config: {state: 'on'},

		replaceTeX: function (base) {
			$(base || '.html_format').find('img[src*="http://tex.s2cms.ru/"], img[src^="https://tex.s2cms.ru/"],' +
				'img[src*="http://latex.codecogs.com/"], img[src^="https://latex.codecogs.com/"]').filter(':visible')
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
			$.getScript('//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML&locale=ru')
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
			this.replaceTeX();
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
		config: {state: 'off'},
		id: 'hes_nmstyle',
		scriptLoaded: function () {
			var module = this;
			var styles;
			var s = document.createElement('style');
			s.id = module.id;
			document.head.appendChild(s);

			if (styles = localStorage.getItem(module.id)) {
				s.textContent = styles;
			}

			ajax('https://rawgit.com/WaveCutz/habrahabr.ru_night-mode/master/userstyle.css', function (data) {
				localStorage.setItem(module.id, data);
				s.textContent = data;
			});

			module.nmInterval = setInterval(function () {
				document.head.appendChild(document.getElementById(module.id))
			}, 200)
		},
		documentLoaded: function () {
			if (this.nmInterval) {
				clearInterval(this.nmInterval);
				this.nmInterval = null;
			}

			var _process = function () {
				$('.content img[src]').each(function () {
					var $el = $(this);

					if ($el.is('[src*="latex.codecogs.com"], [src*="tex.s2cms.ru"]')) {
						return $el.addClass('image-inverted')
					}

					var link = $el.attr('src').replace('habrastorage', 'hsto').replace(/^\/\//, 'https://')

					resemble(link).onComplete(function (data) {
						if (data.brightness < 10 && data.alpha > 60) {
							$el.addClass('image-inverted')
						}
					})
				})
			}

			if (window['resemble']) {
				return _process()
			}

			$.getScript('https://rawgit.com/extempl/Resemble.js/master/resemble.js', function () {
				delayedStart(function () {
					return window['resemble']
				}, _process)
			})
		},
		button: {
			text: 'Night mode',
			states: {
				on: function () {
					this.scriptLoaded()
					this.documentLoaded()
				},
				off: function () {
					$('style#hes_nmstyle').remove()
				}
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

	modules.replaceLinks = {
		config: {state: 'on'},
		// regExp: https://gist.github.com/dperini/729294
		linkReg: /((?:(?:https?|ftp):\/\/)(?:(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?[^),\s])/gi,
		template: '<a href="$1" target="_blank" class="unchecked_link" title="Непроверенная ссылка">$1</a>',
		replaceLinks: function (comments) {
			var module = this;
			$(comments).each(function (i, comment) {
				var depth = 5 // максимальная глубина вложенности
				var nodeList = []
				var _seekAndReplace = function (node, depth) {
					if (!--depth) return;
					Array.prototype.forEach.call(node.childNodes, function (node) {
						if (node.nodeType == 3) { // если текст - искать/заменять
							if (!$(node).parent().is('a')) { // если родитель не ссылка
								if ((node.nodeValue.match(module.linkReg) || []).length) {
									nodeList.push(node)
								}
							}
						} else if (node.nodeType == 1) { // если элемент - рекурсивно обходим текстовые ноды
							_seekAndReplace(node, depth)
						}
					})
				}
				_seekAndReplace(comment, depth)

				nodeList.forEach(function (node) {
					$(node).replaceWith(node.nodeValue.replace(module.linkReg, module.template))
				})
			})
		},
		documentLoaded: function () {
			this.replaceLinks('.comment-item + .message')
		},
		commentsReloaded: function () {
			this.replaceLinks('.comment-item.is_new + .message')
		},
		button: {
			text: 'Clickable links',
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
	var config = {}

	Object.keys(modules).forEach(function (key) {
		config[key] = modules[key].config;
	});

	// main logic

	// подгружаем настройки из localStorage
	var updateLSConfig = function () {
		return localStorage.setItem('hes_config', JSON.stringify(config));
	}
	var citem;
	if (citem = localStorage.getItem('hes_config')) {
		citem = JSON.parse(citem);
		extend(config, citem);
	}
	else updateLSConfig()

	// initial start
	Object.keys(modules).forEach(function (key) {
		var module = modules[key];
		if (~['on', 'partially'].indexOf(config[key].state)) {
			(module.scriptLoaded || _f).call(module)
		}
	})

	window.addEventListener('load', delayedStart(function () { return window.jQuery }, function () {
		var $ = window.jQuery;
		$(function () {

			// load main styles
			ajax('https://rawgit.com/keyten/HES/master/style.css', function (data) {
				var $s = $('<style id="hes_mainstyles"></style>')
				$s.text(data).appendTo('head');
			});

			// create config menu layout
			var $tab = $('#settings_tab');
			var $title = $('<div class="title">HES</div>');
			var $menu = $('<div class="menu hes-menu"></div>');
			$tab.append('<div class="line"></div>').append($title).append($menu);

			// title & menu hiding
			$title.attr('title', 'Version: ' + version);
			$title.click(function() {
				$(this).toggleClass('menu-hidden')
			});

			// main

			$('#xpanel').children('.refresh').click(function () {
				var $el = $(this)

				setTimeout(delayedStart.bind(this, function () {
					return !$el.hasClass('loading')
				}, function () {
					$(document).trigger('comments.reloaded')
				}), 100)
			})

			Object.keys(modules).forEach(function (key) {
				var module = modules[key];
				var states = Object.keys(module.button.states)

				var state = config[key].state || states[0];
				if (~['on', 'partially'].indexOf(state)) {
					// document loaded start
					(module.documentLoaded || _f).call(module);

					// comments reloaded event subscription
					if (module.commentsReloaded) {
						$(document).on('comments.reloaded', module.commentsReloaded.bind(module))
					}
				}

				if (!(states || []).length) return; // There is no buttons for module

				var $button = $('<a href="javascript://">' + module.button.text + '</a>')
				if (states.length > 1) $button.attr('data-state', state);

				$button.click(function () {
					var stateIndex = states.indexOf(config[key].state);
					var newState = states[stateIndex + 1] || states[0];
					if (states.length > 1) $(this).attr('data-state', newState);
					config[key].state = newState;
					(module.button.states[newState] && module.button.states[newState].bind(module) || _f)()
					updateLSConfig();
					if (module.commentsReloaded) {
						$(document)[newState]('comments.reloaded', module.commentsReloaded.bind(module))
					}
				}).appendTo($menu);
			})
		})
	}))
})(window)


// Utils

function ajax(url, callback) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			callback(xhttp.responseText);
		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function trim(str) {
	return str.replace(/^\s+|\s+$/g, '')
}

// http://andrewdupont.net/2009/08/28/deep-extending-objects-in-javascript/
function extend(destination, source) {
	for (var property in source) {
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

function _f() {}
