'use strict';

const {Router: createRouter} = require('express');

/**
 * Get a router for system routes.
 *
 * @param {import('../lib/index').Server} server - The server to add system routes to.
 * @returns {import('express').Router} - Returns the system router.
 */
exports.getSystemRouter = function getSystemRouter(server) {
	const router = createRouter();

	server.log.debug({
		event: 'ROUTES_INITIALIZED',
		message: 'System routes initialized'
	});

	router.get('/health', (request, response) => {
		response.status(200).send({
			ok: true
		});
	});

	return router;
};
