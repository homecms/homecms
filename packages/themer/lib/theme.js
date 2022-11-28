'use strict';

const {dirname, join} = require('node:path');

/**
 * @typedef {object} ThemeConfig
 * @property {string} themeName - The name of the theme.
 * @property {import('@homecms/logger').Logger} logger - The logger to use.
 */

/**
 * Class representing a theme.
 */
exports.Theme = class Theme {

	/**
	 * @type {boolean}
	 */
	#isValid = true;

	/**
	 * @type {import('@homecms/logger').Logger}
	 */
	#log;

	/**
	 * @type {object}
	 */
	#meta;

	/**
	 * Theme constructor.
	 *
	 * @param {ThemeConfig} config - The theme configuration.
	 */
	constructor({logger, themeName}) {
		this.#log = logger;
		this.#meta = {name: themeName};

		try {
			let themeManifestPath;
			let themeManifest;

			// Try resolving the theme path
			try {
				themeManifestPath = require.resolve(`${themeName}/package.json`);
				themeManifest = require(themeManifestPath);
			} catch (_) {
				throw new Error(`Theme manifest "${themeName}/package.json" cannot not be found or is invalid`);
			}

			// Check for the Home CMS engines entry
			const homecmsVersionSupport = themeManifest?.engines?.homecms;
			if (typeof homecmsVersionSupport !== 'string') {
				throw new Error(`Theme manifest "${themeName}/package.json" does not have an "engines.homecms" property`);
			}
			// TODO task: check if the version range is satisfied

			// Add some metadata
			this.#meta.version = themeManifest.version;
			this.#meta.basePath = dirname(themeManifestPath);
			this.#meta.viewPath = join(this.#meta.basePath, 'views');

			this.#log.debug({
				event: 'THEME_LOADED',
				message: `Theme ${this.name} loaded successfully`,
				themeName: this.name,
				themePath: this.basePath
			});

		// If there are any errors, the theme is invalid
		} catch (/** @type {any} */ error) {
			this.#isValid = false;
			this.#log.error({
				event: 'THEME_LOAD_FAILED',
				message: error.message
			});
		}
	}

	/**
	 * Get whether the theme is valid.
	 *
	 * @returns {boolean} - Returns whether the theme is valid.
	 */
	get isValid() {
		return this.#isValid;
	}

	/**
	 * Get the theme name.
	 *
	 * @returns {string} - Returns the name.
	 */
	get name() {
		return this.#meta.name;
	}

	/**
	 * Get the theme version.
	 *
	 * @returns {string} - Returns the version.
	 */
	get version() {
		return this.#meta.version;
	}

	/**
	 * Get the theme base directory path.
	 *
	 * @returns {string} - Returns the base path.
	 */
	get basePath() {
		return this.#meta.basePath;
	}

	/**
	 * Get the theme view directory path.
	 *
	 * @returns {string} - Returns the view path.
	 */
	get viewPath() {
		return this.#meta.viewPath;
	}

};
