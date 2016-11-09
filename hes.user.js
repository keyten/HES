(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _class = function () {
	function _class(options) {
		_classCallCheck(this, _class);

		this.options = { path: 'hes_config' };

		Object.assign(this.options, options);
	}

	_createClass(_class, [{
		key: 'setValue',
		value: function setValue(key, data) {
			if (typeof this._data[this.options.key] == 'string' || !this._data[this.options.key]) {
				this._data[this.options.key] = {};
			}
			this._data[this.options.key][key] = data;
			this._save();
		}
	}, {
		key: 'removeValue',
		value: function removeValue(key) {
			delete this._data[this.options.key][key];
			this._save();
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.value = false;
		}
	}, {
		key: 'toggleValue',
		value: function toggleValue(key, data) {
			if (this.value) {
				this.removeValue(key);
			} else {
				this.setValue(key, data);
			}
		}
	}, {
		key: '_load',
		value: function _load() {
			this._data = JSON.parse(localStorage.getItem(this.options.path) || '{}');
			return this._data;
		}
	}, {
		key: '_save',
		value: function _save() {
			localStorage.setItem(this.options.path, JSON.stringify(this._data));
		}
	}, {
		key: 'values',
		get: function get() {
			var _this = this;

			this._load();
			return Object.keys(this._data[this.options.key]).map(function (key) {
				return _this._data[_this.options.key][key];
			});
		}
	}, {
		key: 'value',
		get: function get() {
			this._load();
			return this._data[this.options.key];
		},
		set: function set(data) {
			this._data[this.options.key] = data;
			this._save();
		}
	}]);

	return _class;
}();

exports.default = _class;

},{}],2:[function(require,module,exports){
'use strict';

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _modules = require('./modules.js');

var modules = _interopRequireWildcard(_modules);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
// @version     2.4.0
// @grant       none
// @run-at      document-start
// ==/UserScript==
var VERSION = '2.4.0';

Object.keys(modules).forEach(function (key) {
	var module = modules[key];
	var config = new _config2.default({ key: key });
	config.value = Object.assign({}, module.config, config.value);

	// initial start
	if (['on', 'partially'].includes(config.value.state)) {
		(module.scriptLoaded || Utils._f).call(module);
	}
});

{
	// add HES dropdown ASAP to load it with HH dropdown initializer
	var dropdown = document.createElement('div');
	dropdown.className = 'dropdown dropdown_hes';
	dropdown.style.display = 'none';
	var dropdownHTML = '\n\t\t<button type="button" class="btn btn_x-large btn_navbar_hes-dropdown" \n\t\t\t\tdata-toggle="dropdown" aria-haspopup="true" role="button" \n\t\t\t\taria-expanded="false" title="Version: ' + VERSION + '">HES</button>\n\t\t<div class="dropdown-container dropdown-container_white" aria-hidden="true" role="menu">\n\t\t\t<ul class="n-dropdown-menu n-dropdown-menu_hes"></ul>\n\t\t</div>\n\t';
	dropdown.innerHTML = dropdownHTML;
	document.querySelector('html').appendChild(dropdown);
}
window.addEventListener('load', Utils.delayedStart(function () {
	return window.jQuery;
}, function () {
	var $ = window.jQuery;
	$(function () {

		// load main styles

		Utils.ajax('https://rawgit.com/keyten/HES/master/style.css', function (data) {
			var $s = $('<style id="hes_mainstyles"></style>');
			$s.text(data).appendTo('head');
		});

		$('.dropdown_hes').insertBefore($('.main-navbar__section_right .dropdown_user')).show();
		var $menu = $('.n-dropdown-menu_hes');

		// main

		$('#xpanel').children('.refresh').click(function () {
			var $el = $(this);

			setTimeout(Utils.delayedStart.bind(this, function () {
				return !$el.hasClass('loading');
			}, function () {
				$(document).trigger('comments.reloaded');
			}), 300);
		});

		Object.keys(modules).forEach(function (key) {
			var module = modules[key];
			var states = Object.keys(module.button.states);
			var config = new _config2.default({ key: key });

			var state = config.value.state || states[0];
			if (['on', 'partially'].includes(state)) {
				// document loaded start
				(module.documentLoaded || Utils._f).call(module);

				// comments reloaded event subscription
				if (module.commentsReloaded) {
					$(document).on('comments.reloaded', module.commentsReloaded.bind(module));
				}
			}

			if (!(states || []).length) return; // There is no buttons for module

			var $menuItem = $('<li class="n-dropdown-menu__item" />');
			var $button = $('<a href="#" class="n-dropdown-menu__item-link">' + module.button.text + '</a>');
			$menuItem.append($button);
			if (states.length > 1) $button.attr('data-state', state);

			$button.click(function (e) {
				e.preventDefault();
				e.stopPropagation();
				var stateIndex = states.indexOf(config.value.state);
				var newState = states[stateIndex + 1] || states[0];
				if (states.length > 1) $(this).attr('data-state', newState);
				config.setValue('state', newState);
				(module.button.states[newState] || Utils._f).call(module);
				if (module.commentsReloaded && ['on', 'off'].includes(newState)) {
					$(document)[newState]('comments.reloaded', module.commentsReloaded.bind(module));
				}
			});
			$menu.append($menuItem);
		});
	});
}));

},{"./config":1,"./modules.js":3,"./utils":12}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hidePosts = require('./modules/hidePosts');

Object.defineProperty(exports, 'hidePosts', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hidePosts).default;
  }
});

var _hideAuthors = require('./modules/hideAuthors');

Object.defineProperty(exports, 'hideAuthors', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hideAuthors).default;
  }
});

var _hideHubs = require('./modules/hideHubs');

Object.defineProperty(exports, 'hideHubs', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hideHubs).default;
  }
});

var _hideFlows = require('./modules/hideFlows');

Object.defineProperty(exports, 'hideFlows', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hideFlows).default;
  }
});

var _hideUserInfo = require('./modules/hideUserInfo');

Object.defineProperty(exports, 'hideUserInfo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hideUserInfo).default;
  }
});

var _mathjax = require('./modules/mathjax');

Object.defineProperty(exports, 'mathjax', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_mathjax).default;
  }
});

var _nightMode = require('./modules/nightMode');

Object.defineProperty(exports, 'nightMode', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_nightMode).default;
  }
});

var _replaceLinks = require('./modules/replaceLinks');

Object.defineProperty(exports, 'replaceLinks', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_replaceLinks).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./modules/hideAuthors":4,"./modules/hideFlows":5,"./modules/hideHubs":6,"./modules/hidePosts":7,"./modules/hideUserInfo":8,"./modules/mathjax":9,"./modules/nightMode":10,"./modules/replaceLinks":11}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = new _config2.default({ key: 'hideAuthors' });
exports.default = {
	config: {
		list: ['alizar', 'marks', 'ivansychev', 'ragequit', 'SLY_G']
	},
	documentLoaded: function documentLoaded() {
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function updatePosts() {
		$('.posts .post').removeClass('hide-post-a').filter(function () {
			var author = Utils.trim($('.post-author__link', this).text()).substr(1);
			return config.value.list.includes(author);
		}).addClass('hide-post-a');
	},
	button: {
		text: 'Hide authors',
		states: {
			on: function on() {
				var list = (config.value.list || []).join(', ');
				var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
				if (auth == null) return;
				config.setValue('list', auth.replace(/\s/g, '').split(','));
				this.updatePosts();
			}
		}
	}
};

},{"../config":1,"../utils":12}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = new _config2.default({ key: 'hideFlows' });
exports.default = {
	config: {
		list: ['marketing', 'management']
	},
	getName: function getName() {
		return this.length && $(this).attr("href").split("/")[4];
	},
	documentLoaded: function documentLoaded() {
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function updatePosts() {
		var module = this;

		$('.posts .post').removeClass('hide-post-f').filter(function () {

			var flow = module.getName.call($(this).find('.post__flow'));
			return config.value.list.includes(flow);
		}).addClass('hide-post-f');
	},
	button: {
		text: 'Hide flows',
		states: {
			on: function on() {
				var list = (config.value.list || []).join(', ');
				var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
				if (auth == null) return;
				config.setValue('list', auth.replace(/\s/g, '').split(','));
				this.updatePosts();
			}
		}
	}
};

},{"../config":1}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = new _config2.default({ key: 'hideHubs' });
exports.default = {
	config: {
		list: ['mvideo', 'icover', 'gearbest']
	},
	getName: function getName() {
		return $(this).attr("href").split("/")[4];
	},
	documentLoaded: function documentLoaded() {
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function updatePosts() {
		var module = this;

		$('.posts .post').removeClass('hide-post-h').filter(function () {
			var hubNames = $('.hub, .megapost-head__hubs .list__item-link', this).map(module.getName).get();
			return config.value.list.some(function (hub) {
				return hubNames.includes(hub);
			});
		}).addClass('hide-post-h');
	},
	button: {
		text: 'Hide hubs',
		states: {
			on: function on() {
				var list = (config.value.list || []).join(', ');
				var auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
				if (!auth) return;
				config.setValue('list', auth.replace(/\s/g, '').split(','));
				this.updatePosts();
			}
		}
	}
};

},{"../config":1}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	config: { state: 'partially' },
	documentLoaded: function documentLoaded() {
		this.button.states[this.config.state].call(this);
	},
	button: {
		text: 'Hide posts',
		states: {
			on: function on() {
				this.button.states.off();
				$('.posts').addClass('hide');
			},
			off: function off() {
				$('.posts').removeClass('hide hide-partially');
			},
			partially: function partially() {
				this.button.states.off();
				$('.posts').addClass('hide-partially');
			}
		}
	}
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	config: { state: 'off' },
	documentLoaded: function documentLoaded() {
		$('*[rel=user-popover]').webuiPopover('destroy');
	},
	button: {
		text: 'Hide UserInfo',
		states: {
			on: function on() {
				this.documentLoaded();
			},
			off: null
		}
	}
};

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	config: { state: 'on' },

	replaceTeX: function replaceTeX(base) {
		$(base || '.html_format').find('img[src*="//tex.s2cms.ru/"], img[src*="//latex.codecogs.com/"]').filter(':visible').each(function () {

			var $this = $(this);

			// парсим код
			var decodedURL = decodeURIComponent(this.src);
			var code = decodedURL.replace(/^https?:\/\/tex\.s2cms\.ru\/(svg|png)\/(\\inline)?/, '').replace(/^https?:\/\/latex\.codecogs\.com\/gif\.latex\?(\\dpi\{\d+})?/, '').replace(/\\(right|left)\s([\[{\]}(|)])/g, "\\$1$2") // мерджим ошибочные резделители
			.replace(/\\(right|left)\s/g, ''); // игнорируем пустые разделители

			// проверяем, использовать $ или $$
			code = '$tex' + code + '$';
			if ($this.parent().is('div[style="text-align:center;"]') || $this.prev().is('br')) {
				code = '$' + code + '$';
			}

			// скрываем картинку и выводим TeX
			$this.hide().after('<span>' + code + '</span>');
		});
		$.getScript('//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML&locale=ru');
	},

	addEditorButton: function addEditorButton() {
		if ($('.editor-btn-latex').length) {
			return;
		}

		var $button = $("<a class=\"btn editor-btn-tex\" title=\"Преобразовать выделенное в TeX\" \
			href=\"//tex.s2cms.ru/g/TeX\" target=\"_blank\" tabindex=\"-1\">\
			<span class=\"g-icon g-icon-tex\"></span></a>");

		$('.wysiwyg_wrapper .help_holder').before($button);

		$button.click(function (e) {
			e.preventDefault();
			e.stopPropagation();

			var $textarea = $('#text_textarea, #comment_text')[0];

			var val = void 0;
			if ($textarea.selectionStart == $textarea.selectionEnd) {
				val = window.prompt('Выберите формулу в редакторе и нажмите кнопку, либо же введите формулу ниже:');
			} else {
				val = $textarea.value.substring($textarea.selectionStart, $textarea.selectionEnd);
			}

			val = Utils.trim(val);

			if (!val) {
				return;
			}

			var img = "<img src=\"//tex.s2cms.ru/svg/" + encodeURIComponent(val) + "\" alt=\"" + val.replace(/"/g, '\\"') + "\" />";

			var taArr = $textarea.value.split('');
			taArr.splice($textarea.selectionStart, $textarea.selectionEnd - $textarea.selectionStart, img);

			$textarea.value = taArr.join('');
		});
	},

	documentLoaded: function documentLoaded() {
		// подключаем mathjax
		if (!$('[type="text/x-mathjax-config"]').length) {
			$('<script type="text/x-mathjax-config"> \n\t\t\t\t\tMathJax.Hub.Config({ \n\t\t\t\t\t\ttex2jax:{ \n\t\t\t\t\t\t\tinlineMath:[[\'$tex\',\'$\']], \n\t\t\t\t\t\t\tdisplayMath:[[\'$$tex\',\'$$\']] \n\t\t\t\t\t\t}, \n\t\t\t\t\t\tasciimath2jax:{delimiters:[[\'$asc\',\'$\']]} \n\t\t\t\t\t}); \n\t\t\t\t\tMathJax.Hub.Register.MessageHook(\'TeX Jax - parse error\', function (message) { \n\t\t\t\t\t\tconsole.error(message); \n\t\t\t\t\t\tvar $span = $(message[4]).parent(); \n\t\t\t\t\t\t$span.prev(\'img\').show(); \n\t\t\t\t\t\t$span.remove() \n\t\t\t\t\t}); \n\t\t\t\t</script>').appendTo('head');
		}

		// заменяем картинки на формулы
		this.replaceTeX();

		this.addEditorButton();
	},

	commentsReloaded: function commentsReloaded() {
		this.replaceTeX('.comment-item.is_new + .message');
	},
	button: {
		text: 'MathJax',
		states: {
			on: function on() {
				this.documentLoaded();
			},
			off: null
		}
	}
};

},{"../utils":12}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
	config: { state: 'off' },
	id: 'hes_nmstyle',
	nmInterval: null,
	scriptLoaded: function scriptLoaded() {
		var _this = this;

		var styles = void 0;
		var s = document.createElement('style');
		s.id = this.id;
		document.head.appendChild(s);

		if (styles = localStorage.getItem(this.id)) {
			s.textContent = styles;
		}

		Utils.ajax('https://rawgit.com/WaveCutz/habrahabr.ru_night-mode/master/source.css', function (data) {
			localStorage.setItem(_this.id, data);
			s.textContent = data;
		});

		this.nmInterval = setInterval(function () {
			document.head.appendChild(s);
		}, 200);
	},
	documentLoaded: function documentLoaded() {
		if (this.nmInterval) {
			clearInterval(this.nmInterval);
			this.nmInterval = null;
		}

		function _process() {
			$('.content img[src]:visible').each(function () {
				var $el = $(this);

				if ($el.is('[src*="latex.codecogs.com"], [src*="tex.s2cms.ru"]')) {
					return $el.addClass('image-inverted');
				}

				var link = $el.attr('src').replace('habrastorage', 'hsto').replace(/^\/\//, 'https://');

				resemble(link).onComplete(function (data) {
					if (data.brightness < 10 && data.alpha > 60 || data.brightness < 6 && data.alpha > 30 || data.brightness < 1 || data.brightness > 87 && data.white > 60) {
						$el.addClass('image-inverted');
					}
				});
			});
		}

		if (window['resemble']) {
			return _process();
		}

		$.getScript('https://rawgit.com/extempl/Resemble.js/master/resemble.js', function () {
			Utils.delayedStart(function () {
				return window['resemble'];
			}, _process);
		});
	},
	button: {
		text: 'Night mode',
		states: {
			on: function on() {
				this.scriptLoaded();
				this.documentLoaded();
			},
			off: function off() {
				$('style#hes_nmstyle').remove();
			}
		}
	}
};

},{"../utils":12}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {
	config: { state: 'on' },
	// regExp: https://gist.github.com/dperini/729294 TODO ignore closing bracket outside of RegExp if there was not open bracket
	linkReg: /((?:(?:https?|ftp):\/\/)(?:(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?[^),;.\s]?)/gi,
	template: '<a href="$1" target="_blank" class="unchecked_link" title="Непроверенная ссылка">$1</a>',
	replaceLinks: function replaceLinks(comments) {
		var _this = this;

		$(comments).each(function (i, comment) {
			var depth = 5; // максимальная глубина вложенности
			var nodeList = [];
			var _seekAndReplace = function _seekAndReplace(node, depth) {
				if (! --depth) return;
				Array.prototype.forEach.call(node.childNodes, function (node) {
					if (node.nodeType == 3) {
						// если текст - искать/заменять
						if (!$(node).parents('a, code').length) {
							// если среди родителей нет ссылки и кода
							if ((node.nodeValue.match(_this.linkReg) || []).length) {
								nodeList.push(node);
							}
						}
					} else if (node.nodeType == 1) {
						// если элемент - рекурсивно обходим текстовые ноды
						_seekAndReplace(node, depth);
					}
				});
			};
			_seekAndReplace(comment, depth);

			nodeList.forEach(function (node) {
				$(node).replaceWith(node.nodeValue.replace(_this.linkReg, _this.template));
			});
		});
	},
	documentLoaded: function documentLoaded() {
		this.replaceLinks('.comment-item + .message');
	},
	commentsReloaded: function commentsReloaded() {
		this.replaceLinks('.comment-item.is_new + .message');
	},
	button: {
		text: 'Clickable links',
		states: {
			on: function on() {
				this.documentLoaded();
			},
			off: null
		}
	}
};

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ajax = ajax;
exports.trim = trim;
exports.delayedStart = delayedStart;
exports._f = _f;
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
	return (str || '').replace(/^\s+|\s+$/g, '');
}

function delayedStart(expr, callback) {
	if (!expr()) {
		return setTimeout(delayedStart.bind(this, expr, callback), 100);
	}
	callback();
}

function _f() {}

},{}]},{},[2]);
