'use strict';

const {v4: uuid} = require('uuid');

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the seeding is complete.
 */
exports.seed = async db => {
	const userId = uuid();
	const baseDate = new Date('2022-01-26T00:00:00Z').valueOf();

	await db('users').insert([
		{
			id: userId,
			email: 'admin@localhost',
			dateCreated: new Date(baseDate)
		}
	]);

};
