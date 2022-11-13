'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	const pageId = uuid();
	const baseDate = new Date('2022-01-26T13:07:00Z').valueOf();

	// The "/" page went directly to being published

	await db('pages').insert([
		{
			id: pageId,
			path: '/',
			type: 'special',
			dateCreated: new Date(baseDate),
			dateLastModified: new Date(baseDate),
			dateFirstPublished: new Date(baseDate)
		}
	]);

	await db('content').insert([
		{
			pageId,
			status: 'published',
			dateCreated: new Date(baseDate),
			title: 'Home',
			raw: '<p>Test home page</p>'
		}
	]);

};
