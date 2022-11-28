'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	const pageId = uuid();
	const baseDate = new Date('2022-01-26T13:07:00Z').valueOf();

	// The "/draft" page had several drafts but has
	// never been published

	await db('pages').insert([
		{
			id: pageId,
			path: '/draft',
			type: 'single',
			dateCreated: new Date(baseDate),
			dateLastModified: new Date(baseDate + 4_000),
			dateFirstPublished: null
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
			title: 'Draft Page',
			raw: '<p>To-do write this.</p>'
		},
		{
			pageId,
			status: 'draft',
			dateCreated: new Date(baseDate + 4_000),
			title: 'Draft Page',
			raw: '<p>Test draft page</p>'
		}
	]);

};
