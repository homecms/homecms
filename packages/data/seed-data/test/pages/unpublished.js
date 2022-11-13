'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	const pageId = uuid();
	const baseDate = new Date('2022-01-26T13:07:00Z').valueOf();

	// The "/unpublished" page had a draft, was published,
	// and then unpublished

	await db('pages').insert([
		{
			id: pageId,
			path: '/unpublished',
			type: 'single',
			dateCreated: new Date(baseDate),
			dateLastModified: new Date(baseDate + 4_000),
			dateFirstPublished: new Date(baseDate + 2_000)
		}
	]);

	await db('content').insert([
		{
			pageId,
			status: 'draft',
			dateCreated: new Date(baseDate),
			title: 'Untitled Page'
		},
		{
			pageId,
			status: 'published',
			dateCreated: new Date(baseDate + 2_000),
			title: 'Published Page',
			raw: '<p>This page was published.</p>'
		},
		{
			pageId,
			status: 'unpublished',
			dateCreated: new Date(baseDate + 4_000)
		}
	]);

};
