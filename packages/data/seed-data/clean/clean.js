'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {

	// Remove all existing data
	await db('settings').delete();
	await db('content').delete();
	await db('pages').delete();

};
