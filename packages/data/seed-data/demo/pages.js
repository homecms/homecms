'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {

	const pageUUIDs = [
		uuid(),
		uuid(),
		uuid(),
		uuid(),
		uuid(),
		uuid()
	];

	// Remove all existing content and pages
	await db('content').delete();
	await db('pages').delete();

	// Create some pages
	await db('pages').insert([
		{
			id: pageUUIDs[0],
			path: '/',
			type: 'special',
			dateFirstPublished: new Date()
		},
		{
			id: pageUUIDs[1],
			path: '/about',
			parentId: pageUUIDs[0],
			type: 'single',
			dateFirstPublished: new Date()
		},
		{
			id: pageUUIDs[2],
			path: '/blog',
			parentId: pageUUIDs[0],
			type: 'collection',
			dateFirstPublished: new Date()
		},
		{
			id: pageUUIDs[3],
			path: '/blog/post-1',
			parentId: pageUUIDs[2],
			type: 'single',
			dateFirstPublished: new Date()
		},
		{
			id: pageUUIDs[4],
			path: '/blog/post-2',
			parentId: pageUUIDs[2],
			type: 'single',
			dateFirstPublished: new Date()
		},
		{
			id: pageUUIDs[5],
			path: '/old',
			parentId: pageUUIDs[0],
			type: 'single',
			dateFirstPublished: new Date()
		}
	]);

	// Create some content
	await db('content').insert([
		{
			pageId: pageUUIDs[0],
			status: 'published',
			dateCreated: new Date(Date.now() - 4_000),
			title: 'Home',
			raw: '<p>Hello World!</p>'
		},
		{
			pageId: pageUUIDs[1],
			status: 'published',
			dateCreated: new Date(Date.now() - 4_000),
			title: 'About',
			raw: '<p>All about me.</p>'
		},
		{
			pageId: pageUUIDs[1],
			status: 'published',
			dateCreated: new Date(Date.now() - 6_000),
			title: 'About',
			raw: '<p>About me.</p>'
		},
		{
			pageId: pageUUIDs[1],
			status: 'draft',
			dateCreated: new Date(Date.now() - 8_000),
			title: 'About',
			raw: '<p>To-do write this.</p>'
		},
		{
			pageId: pageUUIDs[1],
			status: 'draft',
			dateCreated: new Date(Date.now() - 10_000),
			title: 'Untitled Page',
			raw: ''
		},
		{
			pageId: pageUUIDs[2],
			status: 'published',
			dateCreated: new Date(Date.now() - 4_000),
			title: 'Blog',
			raw: '<p>This is my blog.</p>'
		},
		{
			pageId: pageUUIDs[3],
			status: 'draft',
			dateCreated: new Date(Date.now() - 2_000),
			title: 'Blog Post The First',
			raw: '<p>This is a blog post with some new unpublished content.</p>'
		},
		{
			pageId: pageUUIDs[3],
			status: 'published',
			dateCreated: new Date(Date.now() - 4_000),
			title: 'Blog Post 1',
			raw: '<p>This is a blog post.</p>'
		},
		{
			pageId: pageUUIDs[4],
			status: 'published',
			dateCreated: new Date(Date.now() - 4_000),
			title: 'Blog Post 2',
			raw: '<p>This is another blog post.</p>'
		},
		{
			pageId: pageUUIDs[5],
			status: 'unpublished',
			dateCreated: new Date(Date.now() - 4_000)
		},
		{
			pageId: pageUUIDs[5],
			status: 'published',
			dateCreated: new Date(Date.now() - 6_000),
			title: 'Test Page',
			raw: '<p>This is a test page.</p>'
		}
	]);

};
