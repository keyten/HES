import {default as Config} from '../config'
const config = new Config({key: 'hideFlows'})
export default {
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
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function () {
		const module = this

		$('.posts .post').removeClass('hide-post-f').filter(function () {

			const flow = module.getName.call($(this).find('.post__flow'))
			return config.value.list.includes(flow);
		}).addClass('hide-post-f');
	},
	button: {
		text: 'Hide flows',
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
