'use strict';

const Ajv = require('ajv').default;
const addFormats = require('ajv-formats').default;

/**
 * @typedef {object} ModelOptions
 * @property {import('./index').DataStore} dataStore - The data store to perform operations on.
 * @property {string} [tableName] - The name of the table to query for this model.
 * @property {object} [schema] - The JSON schema to use when validating new/changed documents.
 */

/**
 * @typedef {Object<string, any>} ModelDocument
 */

/**
 * Class representing a data model.
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
	tableName;

	/**
	 * @type {import('ajv').ValidateFunction}
	 */
	#validate;

	/**
	 * Model constructor.
	 *
	 * @param {ModelOptions} options - The model configuration.
	 */
	constructor({dataStore, schema = {}, tableName = ''}) {
		this.dataStore = dataStore;
		this.tableName = tableName;
		const ajv = new Ajv({
			allErrors: true
		});
		addFormats(ajv);
		this.#validate = ajv.compile(schema);
	}

	/**
	 * Validate raw data against the model schema and get any errors.
	 *
	 * @param {Object<string, any>} data - The data to validate.
	 * @returns {Array<import('ajv').ErrorObject>} - Returns an array of validation errors.
	 */
	#getValidationErrors(data) {
		const isValid = this.#validate(data);
		if (isValid) {
			return [];
		}
		return this.#validate.errors || [];
	}

	/**
	 * Assert that raw data validates against the model schema.
	 *
	 * @param {ModelDocument} data - The data to validate.
	 */
	async assertIsValid(data) {
		const errors = this.#getValidationErrors(data);
		if (errors.length) {
			throw Object.assign(new TypeError('Data did not validate against model schema'), {
				code: 'MODEL_VALIDATION_FAILED',
				errors
			});
		}
	}

	/**
	 * Insert multiple documents.
	 *
	 * @param {Array<ModelDocument>} data - The data to insert.
	 * @returns {Promise<Array<ModelDocument>>} - Returns the documents.
	 */
	async insertMany(data) {
		for (const item of data) {
			this.assertIsValid(item);
		}
		return await this.dataStore.knex(this.tableName).insert(data, '*');
	}

	/**
	 * Insert a single document.
	 *
	 * @param {ModelDocument} data - The data to insert.
	 * @returns {Promise<null | ModelDocument>} - Returns the document.
	 */
	async insertOne(data) {
		const inserted = await this.insertMany([data]);
		return inserted[0] || null;
	}

	/**
	 * Find a single document.
	 *
	 * @param {ModelDocument} query - The query to use to find the document.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns the partial query builder.
	 */
	findOne(query) {
		return this.dataStore.knex(this.tableName).first('*').where(query);
	}

};
