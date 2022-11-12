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

	router.get('/__system/health', (request, response) => {
		response.status(200).send({
			environment: server.environment
		});
	});

	return router;
};
