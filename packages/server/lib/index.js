'use strict';

const {Database} = require('@indieweb-cms/database');
const {fastify} = require('fastify');

/**
 * @typedef {object} ServerConfig
 * @property {string} baseURL - Base URL of the locally running app.
 * @property {'ci' | 'development' | 'production'} environment - Environment the CMS will run on.
 * @property {import('@indieweb-cms/logger')} logger - The logger to use.
 * @property {number} port - HTTP port that the CMS will run on.
 */

/**
 * Class representing a server.
 */
exports.Server = class Server {

	/**
	 * @type {import('fastify').FastifyInstance}
	 */
	app;

	/**
	 * @type {import('@indieweb-cms/logger').Logger}
	 */
	log;

	/**
	 * @type {number}
	 */
	port;

	/**
	 * Server constructor.
	 *
	 * @param {ServerConfig & import('@indieweb-cms/database').DatabaseConfig} config - The server configuration.
	 */
	constructor({baseURL, databaseURL, environment, logger, port}) {
		this.port = port;
		this.log = logger;

		this.database = new Database({
			databaseURL,
			logger
		});

		this.app = fastify({
			disableRequestLogging: true, // TODO add this ourselves
			logger
		});

		// Log when the server is ready to accept connections
		this.app.addHook('onReady', async () => {
			logger.info({
				event: 'SERVER_STARTED',
				message: `Server is ready to accept connections`,
				baseURL,
				environment
			});
		});

		// Declare a route
		this.app.get('/', async (request, reply) => {
			const tables = await this.database.knex('pg_catalog.pg_tables')
				.select('tablename')
				.where({schemaname: 'public'});
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
							<p>There are database tables:</p>
							<ul>
								${tables.map(({tablename}) => `<li>${tablename}</li>`).join('\n')}
							</ul>
						</body>
					</html>
				`);
		});
	}

	/**
	 * Start the server.
	 *
	 * @returns {Promise<void>} - Resolves when the server has been started.
	 */
	async start() {
		await this.app.listen({
			port: this.port
		});
	}

	/**
	 * Stop the server.
	 *
	 * @returns {Promise<void>} - Resolves when the server has been stopped.
	 */
	async stop() {
		await this.app.close();
		await this.database.disconnect();
	}

};
