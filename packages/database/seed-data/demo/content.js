'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {

	const contentUUIDs = [
		uuid(),
		uuid(),
		uuid(),
		uuid(),
		uuid()
	];

	// Create some content
	await db('content').insert([
		{
			id: contentUUIDs[0],
			path: '/',
			raw: `<p>Hello World!</p>`
		},
		{
			id: contentUUIDs[1],
			path: '/about',
			parentId: contentUUIDs[0],
			raw: `<p>All about me.</p>`
		},
		{
			id: contentUUIDs[2],
			path: '/blog',
			parentId: contentUUIDs[0],
			raw: `<p>This is my blog.</p>`
		},
		{
			id: contentUUIDs[3],
			path: '/blog/post-1',
			parentId: contentUUIDs[2],
			raw: `<p>This is a blog post.</p>`
		},
		{
			id: contentUUIDs[4],
			path: '/blog/post-2',
			parentId: contentUUIDs[2],
			raw: `<p>This is another blog post.</p>`
		}
	]);

};