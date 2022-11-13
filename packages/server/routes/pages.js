'use strict';

const {Router: createRouter} = require('express');

/**
 * Get a router for page routes.
 *
 * @param {import('../lib/index').Server} server - The server to add page routes to.
 * @returns {import('express').Router} - Returns the page router.
 */
exports.getPagesRouter = function getPagesRouter(server) {
	const {models} = server;
	const router = createRouter();

	// Declare the main pages route
	router.get(/.*/, async (request, response, next) => {

		// Sanitize the path
		let path = request.path.toLowerCase();
		if (path !== '/') {
			path = path.replace(/\/$/, '');
		}

		// Fetch the page
		const page = await models.page.findOneByPath(path);

		// If there's no page, move along - 404
		if (!page) {
			return next();
		}

		// If the page path doesn't match exactly, redirect
		if (page.path !== request.path) {
			return response.redirect(page.path);
		}

		// Get the content for the page
		const content = await models.content.findLiveContentForPage(page.id);

		// If there's no content, we have an unpublished page
		if (!content) {
			// TODO if there's a valid draft key in the request then don't do this?
			return next();
		}

		// If the content is unpublished, we have a deleted page
		if (content.status === 'unpublished') {
			// TODO send an actual HTTP error here instead
			throw Object.assign(new Error('Gone'), {
				statusCode: 410
			});
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
					<main>
						<h1>${content.title}</h1>
						${content.raw}
					</main>
				</body>
			</html>
		`);
	});

	return router;
};
