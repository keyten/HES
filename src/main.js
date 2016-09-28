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
const VERSION = '2.4.0';

import * as Utils from './utils'
import * as modules from './modules.js'
import Config from './config'

Object.keys(modules).forEach(function (key) {
	const module = modules[key];
	const config = new Config({key: key})
	config.value = Object.assign({}, module.config, config.value)

	// initial start
	if (['on', 'partially'].includes(config.value.state)) {
		(module.scriptLoaded || Utils._f).call(module)
	}
})


{ // add HES dropdown ASAP to load it with HH dropdown initializer
	const dropdown = document.createElement('div');
	dropdown.className = 'dropdown dropdown_hes';
	dropdown.style.display = 'none'
	const dropdownHTML = `
		<button type="button" class="btn btn_x-large btn_navbar_hes-dropdown" 
				data-toggle="dropdown" aria-haspopup="true" role="button" 
				aria-expanded="false" title="Version: ${VERSION}">HES</button>
		<div class="dropdown-container dropdown-container_white" aria-hidden="true" role="menu">
			<ul class="n-dropdown-menu n-dropdown-menu_hes"></ul>
		</div>
	`;
	dropdown.innerHTML = dropdownHTML;
	document.querySelector('html').appendChild(dropdown)
}
window.addEventListener('load', Utils.delayedStart(function () {
	return window.jQuery
}, function () {
	const $ = window.jQuery;
	$(function () {

		// load main styles

		Utils.ajax('https://rawgit.com/keyten/HES/master/style.css', function (data) {
			const $s = $('<style id="hes_mainstyles"></style>')
			$s.text(data).appendTo('head');
		});

		$('.dropdown_hes').insertBefore($('.main-navbar__section_right .dropdown_user')).show()
		const $menu = $('.n-dropdown-menu_hes')

		// main

		$('#xpanel').children('.refresh').click(function () {
			const $el = $(this)

			setTimeout(Utils.delayedStart.bind(this, function () {
				return !$el.hasClass('loading')
			}, function () {
				$(document).trigger('comments.reloaded')
			}), 300)
		})

		Object.keys(modules).forEach(function (key) {
			const module = modules[key];
			const states = Object.keys(module.button.states)
			const config = new Config({key: key})

			const state = config.value.state || states[0];
			if (['on', 'partially'].includes(state)) {
				// document loaded start
				(module.documentLoaded || Utils._f).call(module);

				// comments reloaded event subscription
				if (module.commentsReloaded) {
					$(document).on('comments.reloaded', module.commentsReloaded.bind(module))
				}
			}

			if (!(states || []).length) return; // There is no buttons for module

			const $menuItem = $('<li class="n-dropdown-menu__item" />');
			const $button = $(`<a href="#" class="n-dropdown-menu__item-link">${module.button.text}</a>`);
			$menuItem.append($button);
			if (states.length > 1) $button.attr('data-state', state);

			$button.click(function (e) {
				e.preventDefault()
				e.stopPropagation()
				const stateIndex = states.indexOf(config.value.state);
				const newState = states[stateIndex + 1] || states[0];
				if (states.length > 1) $(this).attr('data-state', newState);
				config.setValue('state', newState);
				(module.button.states[newState] || Utils._f).call(module);
				if (module.commentsReloaded && ['on', 'off'].includes(newState)) {
					$(document)[newState]('comments.reloaded', module.commentsReloaded.bind(module))
				}
			})
			$menu.append($menuItem);
		})
	})
}))
