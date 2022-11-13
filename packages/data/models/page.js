'use strict';

const {Model} = require('../lib/model');

/**
 * The JSON Schema for the model.
 */
const schema = {
	title: 'Page',
	description: 'A page on the website',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			format: 'uuid'
		},
		path: {
			type: 'string',
			minLength: 1,
			maxLength: 255,
			pattern: '^(\\/[a-z0-9\\._-]+){1,}$' // Path-like, no trailing slash
		},
		parentId: {
			type: 'string',
			format: 'uuid'
		},
		type: {
			type: 'string',
			enum: ['collection', 'single', 'special']
		},
		dateCreated: {
			type: 'string',
			format: 'date-time' // TODO this is probably wrong
		},
		dateLastModified: {
			type: 'string',
			format: 'date-time' // TODO this is probably wrong
		},
		dateFirstPublished: {
			type: 'string',
			format: 'date-time' // TODO this is probably wrong
		},
		title: {
			type: 'string',
			minLength: 1,
			maxLength: 255,
			pattern: '\\w' // At least one word character
		},
		raw: {
			type: 'string'
		}
	},
	required: [
		'path'
	]
};

/**
 * Class representing a page model.
 */
exports.PageModel = class PageModel extends Model {

	/**
	 * Page model constructor.
	 *
	 * @param {import('../lib/model').ModelOptions} options - The model configuration.
	 */
	constructor({dataStore}) {
		super({
			dataStore,
			tableName: 'pages',
			schema
		});
	}

	/**
	 * Find a single page by path.
	 *
	 * @param {string} path - The path to find page for.
	 * @returns {Promise<null | Object<string, any>>} - Returns the page.
	 */
	async findOneByPath(path) {
		return await this.findOne({path});
	}

};
