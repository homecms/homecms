'use strict';

/**
 * @typedef {object} ModelOptions
 * @property {import('../lib/index').Database} database - The database to perform operations on.
 */

/**
 * Class representing a content model.
 */
exports.ContentModel = class ContentModel {

	/**
	 * @type {import('../lib/index').Database}
	 */
	#database;

	/**
	 * Model constructor.
	 *
	 * @param {ModelOptions} options - The model configuration.
	 */
	constructor({database}) {
		this.#database = database;
	}

	/**
	 * Find a single piece of content by path.
	 *
	 * @param {string} path - The path to find content for.
	 * @returns {Promise<any>} - TODO.
	 */
	async findContentByPath(path) {
		// TODO create a class representation of the content
		return await this.#database.knex('content').first('*').where({path});
	}

};
