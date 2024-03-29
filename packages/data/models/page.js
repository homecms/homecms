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
			format: 'date-time' // TODO warning: this is probably wrong
		},
		dateLastModified: {
			type: 'string',
			format: 'date-time' // TODO warning: this is probably wrong
		},
		dateFirstPublished: {
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
	 * Find many pages.
	 *
	 * @override
	 * @param {boolean} [includeContent] - Whether to include basic content information.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns the partial query builder.
	 */
	findMany(includeContent = true) {
		if (!includeContent) {
			return super.findMany();
		}
		const {knex, models} = this.dataStore;
		const {tableName} = this;
		const joinTableName = models.content.tableName;
		const tmpTableName = 'liveContent';

		return knex.select(
			`${tableName}.*`,
			`${tmpTableName}.title`,
			`${tmpTableName}.raw`,
			`${tmpTableName}.status`
		)
			.from(tableName)
			.innerJoin(
				knex.select('*').from(joinTableName)
					.distinctOn('pageId')
					.orderBy([
						'pageId',
						{
							column: 'dateCreated',
							order: 'desc'
						}
					])
					.as(tmpTableName),
				`${tableName}.id`, '=', `${tmpTableName}.pageId`
			);
	}

	/**
	 * Find a single page by path.
	 *
	 * @param {string} path - The path to find page for.
	 * @returns {import('knex').Knex.QueryBuilder} - Returns a partial query requesting the page.
	 */
	findOneByPath(path) {
		return this.findOne().where({path});
	}

};
