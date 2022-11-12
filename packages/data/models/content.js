'use strict';

const {Model} = require('../lib/model');

/**
 * Class representing a content model.
 */
exports.ContentModel = class ContentModel extends Model {

	/**
	 * @protected
	 * @readonly
	 * @type {string}
	 */
	tableName = 'content';

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
