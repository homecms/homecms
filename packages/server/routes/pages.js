'use strict';

const {Gone: GoneError} = require('http-errors');
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

	server.log.debug({
		event: 'ROUTES_INITIALIZED',
		message: 'Page routes initialized'
	});

	// Declare the main pages route
	router.get(/.*/, async (request, response, next) => {
		try {

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
				// TODO task: if there's a valid draft key in the request then don't do this?
				return next();
			}

			// If the content is unpublished, we have a deleted page
			if (content.status === 'unpublished') {
				throw new GoneError();
			}

			// Output the content
			response.render('page', {
				page,
				content
			});
		} catch (error) {
			next(error);
		}
	});

	return router;
};
