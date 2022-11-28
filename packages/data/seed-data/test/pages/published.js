'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	const pageId = uuid();
	const baseDate = new Date('2022-01-26T13:07:00Z').valueOf();

	// The "/published" page had several drafts,
	// was published, then published again with changes

	await db('pages').insert([
		{
			id: pageId,
			path: '/published',
			type: 'single',
			dateCreated: new Date(baseDate),
			dateLastModified: new Date(baseDate + 6_000),
			dateFirstPublished: new Date(baseDate + 4_000)
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
			status: 'draft',
			dateCreated: new Date(baseDate + 2_000),
			title: 'Untitled Page',
			raw: '<p>To-do write this.</p>'
		},
		{
			pageId,
			status: 'published',
			dateCreated: new Date(baseDate + 4_000),
			title: 'Published',
			raw: '<p>Test published page</p>'
		},
		{
			pageId,
			status: 'published',
			dateCreated: new Date(baseDate + 6_000),
			title: 'Published Page',
			raw: '<p>Test published page</p>'
		}
	]);

};
