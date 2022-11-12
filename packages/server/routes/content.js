'use strict';

const {Router: createRouter} = require('express');

/**
 * Get a router for content routes.
 *
 * @param {import('../lib/index').Server} server - The server to add content routes to.
 * @returns {import('express').Router} - Returns the content router.
 */
exports.getContentRouter = function getContentRouter(server) {
	const {models} = server;
	const router = createRouter();

	// Declare the main content route
	router.get(/.*/, async (request, response, next) => {

		// Sanitize the path
		let path = request.path.toLowerCase();
		if (path !== '/') {
			path = path.replace(/\/$/, '');
		}

		// Fetch the content
		const content = await models.content.findOneByPath(path);

		// If there's no content, move along
		if (!content) {
			return next();
		}

		// If the content path doesn't match exactly, redirect
		if (content.path !== request.path) {
			return response.redirect(content.path);
		}

		// Output the content
		response.set('content-type', 'text/html; charset=utf-8');
		response.send(`
			<!DOCTYPE html>
			<html>
				<head>
					<title>${content.title}</title>
				</head>
				<body>
					${content.raw}
				</body>
			</html>
		`);
	});

	return router;
};
