'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.up = async db => {
	await db.schema.createTable('exampleTable', table => {
		table.string('exampleColumn');
	});
};

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.down = async db => {
	await db.schema.dropTable('exampleTable');
};
