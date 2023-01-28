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
		pageId: {
			type: 'string',
			format: 'uuid'
		},
		status: {
			type: 'string',
			enum: ['draft', 'published', 'unpublished']
		},
		dateCreated: {
			type: 'string',
			format: 'date-time' // TODO warning: this is probably wrong
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
		'pageId'
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
	 * Create a query that can be used in a subquery to get the latest content.
	 *
	 * @returns {import('knex').Knex.QueryBuilder} - Returns the partial query builder.
	 */
	createLiveContentSubquery() {
		return ContentModel.addLiveContentConditions(this.dataStore.knex(this.tableName));
	}

	/**
	 * Find the live piece of content for a page.
	 *
	 * @param {string} pageId - The page ID to find content for.
	 * @returns {Promise<null | Object<string, any>>} - Returns the page.
	 */
	async findLiveContentForPage(pageId) {
		return await ContentModel.addLiveContentConditions(this.findOne().where({pageId}));
	}

	/**
	 * Add conditions to a query to ensure that the latest live content is fetched.
	 *
	 * @param {import('knex').Knex.QueryBuilder} queryBuilder - A partial query builder.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns the amended query.
	 */
	static addLiveContentConditions(queryBuilder) {
		return queryBuilder
			.where('status', 'in', ['published', 'unpublished'])
			.orderBy('dateCreated', 'desc');
	}

};
