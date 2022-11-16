'use strict';

const {Theme} = require('./theme');

/**
 * @typedef {object} ThemeManagerConfig
 * @property {Array<string>} themeNames - The names of modules to load as themes.
 * @property {import('@homecms/logger').Logger} logger - The logger to use.
 */

/**
 * Class representing a theme manager.
 */
exports.ThemeManager = class ThemeManager {

	/**
	 * @type {Array<Theme>}
	 */
	#themes;

	/**
	 * ThemeManager constructor.
	 *
	 * @param {ThemeManagerConfig} config - The ThemeManager configuration.
	 */
	constructor({logger, themeNames}) {
		this.#themes = themeNames
			.map(themeName => new Theme({
				themeName,
				logger
			}))
			.filter(theme => theme.isValid);
	}

	/**
	 * Get the themes.
	 *
	 * @returns {Array<Theme>} - Returns the themes.
	 */
	get themes() {
		return [...this.#themes];
	}

};

exports.Theme = Theme;
