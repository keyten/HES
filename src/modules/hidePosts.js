export default {
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
