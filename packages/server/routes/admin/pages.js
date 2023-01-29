'use strict';

/**
 * Mount the dashboard routes for the admin panel.
 *
 * @param {import('express').Router} adminRouter - The admin router.
 * @param {import('../../lib/index').Server} server - The server to add admin routes to.
 * @returns {void}
 */
exports.mountPageRoutes = function mountPageRoutes(adminRouter, server) {
	const {models} = server;

	adminRouter.get('/pages/:id', async (request, response, next) => {
		try {

			// Fetch the page
			const page = await models.page.findOneById(request.params.id);

			// If there's no page, move along - 404
			if (!page) {
				return next();
			}

			// Get the page content
			const latestContent = await models.content.findLatestContentForPage(page.id);

			// Output the content
			response.render('admin/pages/show', {
				page,
				latestContent
			});
		} catch (error) {
			next(error);
		}
	});

};
