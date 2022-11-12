'use strict';

/**
 * @typedef {object} ModelOptions
 * @property {import('./index').DataStore} dataStore - The data store to perform operations on.
 */

/**
 * Class representing a content model.
 */
exports.Model = class Model {

	/**
	 * @protected
	 * @readonly
	 * @type {import('./index').DataStore}
	 */
	dataStore;

	/**
	 * @protected
	 * @readonly
	 * @type {string}
	 */
	tableName = 'please extend this';

	/**
	 * Model constructor.
	 *
	 * @param {ModelOptions} options - The model configuration.
	 */
	constructor({dataStore}) {
		this.dataStore = dataStore;
	}

	/**
	 * Find a single entry.
	 *
	 * @param {Object<string, any>} query - The query to use to find the entry.
	 * @returns {Promise<null | Object<string, any>>} - Returns the entry.
	 */
	async findOne(query) {
		return await this.dataStore.knex(this.tableName).first('*').where(query) || null;
	}

};
