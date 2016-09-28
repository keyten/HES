import * as Utils from '../utils'

export default {
	config: {state: 'on'},

	replaceTeX: function (base) {
		$(base || '.html_format').find('img[src*="//tex.s2cms.ru/"], img[src*="//latex.codecogs.com/"]').filter(':visible')
			.each(function () {

				const $this = $(this);

				// парсим код
				const decodedURL = decodeURIComponent(this.src);
				let code = decodedURL.replace(/^https?:\/\/tex\.s2cms\.ru\/(svg|png)\/(\\inline)?/, '')
					.replace(/^https?:\/\/latex\.codecogs\.com\/gif\.latex\?(\\dpi\{\d+})?/, '')
					.replace(/\\(right|left)\s([\[{\]}(|)])/g, "\\$1$2") // мерджим ошибочные резделители
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

	addEditorButton: function () {
		if ($('.editor-btn-latex').length) {
			return
		}

		const $button = $("<a class=\"btn editor-btn-tex\" title=\"Преобразовать выделенное в TeX\" \
			href=\"//tex.s2cms.ru/g/TeX\" target=\"_blank\" tabindex=\"-1\">\
			<span class=\"g-icon g-icon-tex\"></span></a>")

		$('.wysiwyg_wrapper .help_holder').before($button)

		$button.click(function (e) {
			e.preventDefault()
			e.stopPropagation()

			const $textarea = $('#text_textarea, #comment_text')[0]

			let val
			if ($textarea.selectionStart == $textarea.selectionEnd) {
				val = window.prompt('Выберите формулу в редакторе и нажмите кнопку, либо же введите формулу ниже:')
			} else {
				val = $textarea.value.substring($textarea.selectionStart, $textarea.selectionEnd)
			}

			val = Utils.trim(val)

			if (!val) {
				return
			}

			const img = "<img src=\"//tex.s2cms.ru/svg/" + encodeURIComponent(val) + "\" alt=\"" + val.replace(/"/g, '\\"') + "\" />"

			let taArr = $textarea.value.split('')
			taArr.splice($textarea.selectionStart, $textarea.selectionEnd - $textarea.selectionStart, img)

			$textarea.value = taArr.join('')

		})
	},

	documentLoaded: function () {
		// подключаем mathjax
		if (!$('[type="text/x-mathjax-config"]').length) {
			$(`<script type="text/x-mathjax-config"> 
					MathJax.Hub.Config({ 
						tex2jax:{ 
							inlineMath:[['$tex','$']], 
							displayMath:[['$$tex','$$']] 
						}, 
						asciimath2jax:{delimiters:[['$asc','$']]} 
					}); 
					MathJax.Hub.Register.MessageHook('TeX Jax - parse error', function (message) { 
						console.error(message); 
						var $span = $(message[4]).parent(); 
						$span.prev('img').show(); 
						$span.remove() 
					}); 
				</script>`).appendTo('head')
		}

		// заменяем картинки на формулы
		this.replaceTeX()

		this.addEditorButton()
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
