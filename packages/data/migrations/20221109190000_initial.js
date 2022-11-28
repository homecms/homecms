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
		table.string('path').notNullable().unique();
		table.uuid('parentId').nullable().defaultTo(null).references('pages.id');
		table.enum('type', ['collection', 'single', 'special'], {
			enumName: 'pageType',
			useNative: false
		}).notNullable().defaultTo('single');

		// Define date/time columns
		table.timestamp('dateCreated').notNullable().defaultTo(db.fn.now());
		table.timestamp('dateLastModified').notNullable().defaultTo(db.fn.now());
		table.timestamp('dateFirstPublished').nullable();
	});

	// Define the content table
	await db.schema.createTable('content', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.uuid('pageId').notNullable().references('pages.id');
		table.enum('status', ['draft', 'published', 'unpublished'], {
			enumName: 'contentStatus',
			useNative: false
		}).notNullable().defaultTo('draft').index();

		// Define date/time columns
		table.timestamp('dateCreated').notNullable().defaultTo(db.fn.now()).index();

		// Define the actual content columns
		table.string('title').nullable();
		table.text('raw').nullable();
	});

	// Define the settings table
	await db.schema.createTable('settings', table => {

		// Define columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('key').notNullable().unique();
		table.json('data').notNullable();
	});

	// Define the sessions table
	await db.schema.createTable('sessions', table => {

		// Define columns
		table.string('id').notNullable().primary();
		table.json('sess').notNullable();
		table.timestamp('expired').notNullable().index();
	});

	// Define the users table
	await db.schema.createTable('users', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.string('email').notNullable();

		// Define date/time columns
		table.timestamp('dateCreated').notNullable().defaultTo(db.fn.now());

		// Define indexes and relationships
		table.unique(['email']);
	});

	// Define the login tokens table
	await db.schema.createTable('userLoginTokens', table => {

		// Define identifying columns
		table.uuid('id', {primaryKey: true}).defaultTo(db.raw('uuid_generate_v4()'));
		table.uuid('userId').notNullable().references('users.id');

		// Define date/time columns
		table.timestamp('expired').notNullable().index();
	});

};

/**
 * @param {import('knex').Knex} db - The database instance.
 * @returns {Promise<void>} - Resolves when the migration is complete.
 */
exports.down = async db => {
	await db.schema.dropTable('userLoginTokens');
	await db.schema.dropTable('users');
	await db.schema.dropTable('sessions');
	await db.schema.dropTable('settings');
	await db.schema.dropTable('content');
	await db.schema.dropTable('pages');
};
