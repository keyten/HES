"use strict";

export default class {

	constructor(options) {
		this.options = {path: 'hes_config'}

		Object.assign(this.options, options);
	}

	get values () {
		this._load()
		return Object.keys(this._data[this.options.key]).map((key) => {
			return this._data[this.options.key][key]
		})
	}

	get value () {
		this._load()
		return this._data[this.options.key]
	}

	set value (data) {
		this._data[this.options.key] = data
		this._save()
	}

	setValue (key, data) {
		if (typeof this._data[this.options.key] == 'string' || !this._data[this.options.key]) {
			this._data[this.options.key] = {}
		}
		this._data[this.options.key][key] = data
		this._save()
	}

	removeValue (key) {
		delete this._data[this.options.key][key]
		this._save()
	}

	clear () {
		this.value = false
	}

	toggleValue (key, data) {
		if (this.value) {
			this.removeValue(key)
		}
		else {
			this.setValue(key, data)
		}
	}

	_load () {
		this._data = JSON.parse(localStorage.getItem(this.options.path) || '{}')
		return this._data
	}

	_save () {
		localStorage.setItem(this.options.path, JSON.stringify(this._data))
	}
}
