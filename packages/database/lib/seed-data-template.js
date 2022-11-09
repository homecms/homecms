'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	await db('exampleTable').insert([
		{exampleColumn: 'example1'},
		{exampleColumn: 'example2'},
		{exampleColumn: 'example3'}
	]);
};
