'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.up = async db => {

	// Define the main content table
	await db.schema.createTable('content', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('slug');
		table.uuid('parentId');

		// Define the content type column
		table.enum('type', ['collection', 'page']);

		// Define the actual raw content column
		table.text('raw');

		// Define indexes and relationships
		table.unique(['slug']);
		table.foreign('parentId').references('content.id');
	});

	// Define the settings table
	await db.schema.createTable('settings', table => {

		// Define columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('key');
		table.json('data');

		// Define indexes and relationships
		table.unique(['key']);
	});

};

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.down = async db => {
	await db.schema.dropTable('settings');
	await db.schema.dropTable('content');
};
