'use strict';

const {fastify} = require('fastify');
const logger = require('@indieweb-cms/logger');

/**
 * Create an indieweb-cms server.
 *
 * @param {import('@indieweb-cms/config').Config} config - The server configuration.
 * @returns {import('fastify').FastifyInstance} - Returns a new Fastify instance.
 */
function createServer({environment}) {

	// Create the app
	const app = fastify({
		disableRequestLogging: true, // TODO add this ourselves
		logger
	});

	app.addHook('onReady', async () => {
		app.log.info(`Server running in ${environment} environment`);
	});

	// Declare a route
	app.get('/', async (request, reply) => {
		return reply
			.type('text/html; charset=utf-8')
			.send('Hello world!');
	});

	return app;
}

module.exports = createServer;
