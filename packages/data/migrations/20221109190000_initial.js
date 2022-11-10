'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.up = async db => {

	// Enable UUID generation
	await db.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

	// Define the main content table
	await db.schema.createTable('content', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('path').notNullable();
		table.uuid('parentId').nullable().defaultTo(null);

		// Define the actual content columns
		table.string('title').notNullable();
		table.text('raw').notNullable().defaultTo('');

		// Define indexes and relationships
		table.unique(['path']);
		table.foreign('parentId').references('content.id');
	});

	// Define the settings table
	await db.schema.createTable('settings', table => {

		// Define columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('key').notNullable();
		table.json('data').notNullable();

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
