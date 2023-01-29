'use strict';

/**
 * Mount the dashboard routes for the admin panel.
 *
 * @param {import('express').Router} adminRouter - The admin router.
 * @param {import('../../lib/index').Server} server - The server to add admin routes to.
 * @returns {void}
 */
exports.mountDashboardRoutes = function mountDashboardRoutes(adminRouter, server) {
	const {models} = server;

	adminRouter.get('/', async (request, response, next) => {
		try {
			const pages = await models.page.findMany()
				.where('status', '!=', 'unpublished')
				.orderBy('title');
			response.render('admin/dashboard', {
				pages
			});
		} catch (error) {
			next(error);
		}
	});
};
