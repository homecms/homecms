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
	 * Find the live piece of content for a page.
	 *
	 * @param {string} pageId - The page ID to find content for.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns a partial query requesting the content.
	 */
	findLiveContentForPage(pageId) {
		return this.findLatestContentForPage(pageId)
			.where('status', 'in', ['unpublished', 'published']);
	}

	/**
	 * Find the latest piece of content for a page.
	 *
	 * @param {string} pageId - The page ID to find content for.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns a partial query requesting the content.
	 */
	findLatestContentForPage(pageId) {
		return this.findOne()
			.where({pageId})
			.orderBy('dateCreated', 'desc');
	}

};
