'use strict';

const {Model} = require('../lib/model');

/**
 * The JSON Schema for the model.
 */
const schema = {
	title: 'Content',
	description: 'An item of content',
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
		'path',
		'title'
	]
};

/**
 * Class representing a content model.
 */
exports.ContentModel = class ContentModel extends Model {

	/**
	 * Content model constructor.
	 *
	 * @param {import('../lib/model').ModelOptions} options - The model configuration.
	 */
	constructor({dataStore}) {
		super({
			dataStore,
			tableName: 'content',
			schema
		});
	}

	/**
	 * Find a single piece of content by path.
	 *
	 * @param {string} path - The path to find content for.
	 * @returns {Promise<null | Object<string, any>>} - Returns the content.
	 */
	async findOneByPath(path) {
		return this.findOne({path});
	}

};
