'use strict';

const {knex} = require('knex');
const logger = require('@indieweb-cms/logger');

/**
 * Create an indieweb-cms database connection.
 *
 * @param {import('@indieweb-cms/config').Config} config - The database configuration.
 * @returns {import('knex').Knex} - Returns a new Knex database instance.
 */
function createDatabaseConnection({databaseURL}) {

	const database = knex({
		client: 'pg',
		connection: databaseURL,
		searchPath: ['indieweb-cms', 'public'], // TODO do we need this?
		acquireConnectionTimeout: 30 * 1000, // 30 seconds
		log: logger,

		// Configure database migrations
		migrations: {
			tableName: 'migrations'
		}
	});

	return database;
}

module.exports = createDatabaseConnection;
