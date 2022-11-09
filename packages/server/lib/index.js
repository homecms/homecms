'use strict';

const createDatabaseConnection = require('@indieweb-cms/database');
const {fastify} = require('fastify');
const logger = require('@indieweb-cms/logger');

/**
 * Create an indieweb-cms server.
 *
 * @param {import('@indieweb-cms/config').Config} config - The server configuration.
 * @returns {import('fastify').FastifyInstance} - Returns a new Fastify instance.
 */
function createServer(config) {

	// Create the app
	const app = fastify({
		disableRequestLogging: true, // TODO add this ourselves
		logger
	});

	app.addHook('onReady', async () => {
		app.log.info(`Server running in ${config.environment} environment`);
	});

	// Create the database connection
	const db = createDatabaseConnection(config);

	// Declare a route
	app.get('/', async (request, reply) => {
		const tableCount = await db('pg_catalog.pg_tables')
			.select('tablename')
			.where({schemaname: 'indieweb-cms'});
		return reply
			.type('text/html; charset=utf-8')
			.send(`
				<!DOCTYPE html>
				<html>
					<head>
						<title>Hello</title>
					</head>
					<body>
						<p>Hello World!</p>
						<p>There are ${tableCount.length} database tables.</p>
					</body>
				</html>
			`);
	});

	return app;
}

module.exports = createServer;
