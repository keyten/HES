import {default as Config} from '../config'
const config = new Config({key: 'hideHubs'})
export default {
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
		if (!(config.value.list || []).length) return;

		this.updatePosts();
	},
	updatePosts: function () {
		const module = this;

		$('.posts .post').removeClass('hide-post-h').filter(function () {
			const hubNames = $('.hub, .megapost-head__hubs .list__item-link', this).map(module.getName).get()
			return config.value.list.some(function (hub) {
				return hubNames.includes(hub)
			})
		}).addClass('hide-post-h');
	},
	button: {
		text: 'Hide hubs',
		states: {
			on: function () {
				const list = (config.value.list || []).join(', ');
				const auth = window.prompt('Через запятую (можно пробелы), регистр важен', list);
				if (!auth)
					return;
				config.setValue('list', auth.replace(/\s/g, '').split(','))
				this.updatePosts();
			}
		}
	}
}
