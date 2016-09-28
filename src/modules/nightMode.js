import * as Utils from '../utils'

export default {
	config: {state: 'off'},
	id: 'hes_nmstyle',
	nmInterval: null,
	scriptLoaded: function () {
		let styles;
		const s = document.createElement('style');
		s.id = this.id;
		document.head.appendChild(s);

		if (styles = localStorage.getItem(this.id)) {
			s.textContent = styles;
		}

		Utils.ajax('https://rawgit.com/WaveCutz/habrahabr.ru_night-mode/master/userstyle.css', (data) => {
			localStorage.setItem(this.id, data);
			s.textContent = data;
		});

		this.nmInterval = setInterval(() => {
			document.head.appendChild(s)
		}, 200)
	},
	documentLoaded: function () {
		if (this.nmInterval) {
			clearInterval(this.nmInterval);
			this.nmInterval = null;
		}

		function _process() {
			$('.content img[src]:visible').each(function () {
				const $el = $(this);

				if ($el.is('[src*="latex.codecogs.com"], [src*="tex.s2cms.ru"]')) {
					return $el.addClass('image-inverted')
				}

				const link = $el.attr('src').replace('habrastorage', 'hsto').replace(/^\/\//, 'https://')

				resemble(link).onComplete(function (data) {
					if (data.brightness < 10 && data.alpha > 60 ||
						data.brightness < 6 && data.alpha > 30 ||
						data.brightness < 1 ||
						data.brightness > 87 && data.white > 60) {
						$el.addClass('image-inverted')
					}
				})
			})
		}

		if (window['resemble']) {
			return _process()
		}

		$.getScript('https://rawgit.com/extempl/Resemble.js/master/resemble.js', function () {
			Utils.delayedStart(function () {
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
