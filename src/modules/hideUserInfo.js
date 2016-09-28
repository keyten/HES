export default {
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
