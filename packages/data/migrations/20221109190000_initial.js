'use strict';

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.up = async db => {

	// Enable UUID generation
	await db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

	// Define the pages table
	await db.schema.createTable('pages', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('path').notNullable();
		table.uuid('parentId').nullable().defaultTo(null);
		table.enum('type', ['collection', 'single', 'special'], {
			enumName: 'pageType',
			useNative: false
		}).notNullable().defaultTo('single');

		// Define date/time columns
		table.timestamp('dateCreated').notNullable().defaultTo(db.fn.now());
		table.timestamp('dateLastModified').notNullable().defaultTo(db.fn.now());
		table.timestamp('dateFirstPublished').nullable();

		// Define indexes and relationships
		table.unique(['path']);
		table.foreign('parentId').references('pages.id');
	});

	// Define the content table
	await db.schema.createTable('content', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.uuid('pageId').notNullable();
		table.enum('status', ['draft', 'published', 'unpublished'], {
			enumName: 'contentStatus',
			useNative: false
		}).notNullable().defaultTo('draft');

		// Define date/time columns
		table.timestamp('dateCreated').notNullable().defaultTo(db.fn.now());

		// Define the actual content columns
		table.string('title').nullable();
		table.text('raw').nullable();

		// Define indexes and relationships
		table.index(['status', 'dateCreated']);
		table.foreign('pageId').references('pages.id');
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
	await db.schema.dropTable('pages');
};
