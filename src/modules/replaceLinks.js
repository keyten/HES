export default {
	config: {state: 'on'},
	// regExp: https://gist.github.com/dperini/729294 TODO ignore closing bracket outside of RegExp if there was not open bracket
	linkReg: /((?:(?:https?|ftp):\/\/)(?:(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[\/?#]\S*)?[^),;.\s]?)/gi,
	template: '<a href="$1" target="_blank" class="unchecked_link" title="Непроверенная ссылка">$1</a>',
	replaceLinks: function (comments) {
		$(comments).each((i, comment) => {
			let depth = 5 // максимальная глубина вложенности
			const nodeList = []
			const _seekAndReplace = (node, depth) => {
				if (!--depth) return;
				Array.prototype.forEach.call(node.childNodes, (node) => {
					if (node.nodeType == 3) { // если текст - искать/заменять
						if (!$(node).parents('a, code').length) { // если среди родителей нет ссылки и кода
							if ((node.nodeValue.match(this.linkReg) || []).length) {
								nodeList.push(node)
							}
						}
					} else if (node.nodeType == 1) { // если элемент - рекурсивно обходим текстовые ноды
						_seekAndReplace(node, depth)
					}
				})
			}
			_seekAndReplace(comment, depth)

			nodeList.forEach((node) => {
				$(node).replaceWith(node.nodeValue.replace(this.linkReg, this.template))
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
