import {default as Config} from '../config'
import * as Utils from '../utils'
const config = new Config({key: 'hideAuthors'})
export default {
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
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function () {
		$('.posts .post').removeClass('hide-post-a').filter(function () {
			const author = Utils.trim($('.post-author__link', this).text()).substr(1);
			return config.value.list.includes(author);
		}).addClass('hide-post-a');
	},
	button: {
		text: 'Hide authors',
		states: {
			on: function () {
				const list = (config.value.list || []).join(', ');
				const auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
				if (auth == null)
					return;
				config.setValue('list', auth.replace(/\s/g, '').split(','));
				this.updatePosts();
			}
		}
	}
}
