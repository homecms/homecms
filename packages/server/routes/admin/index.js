'use strict';

const {mountDashboardRoutes} = require('./dashboard');
const {mountLoginRoutes} = require('./login');
const {mountPageRoutes} = require('./pages');
const {Router: createRouter} = require('express');

/**
 * Get a router for admin routes.
 *
 * @param {import('../../lib/index').Server} server - The server to add admin routes to.
 * @returns {import('express').Router} - Returns the admin router.
 */
exports.getAdminRouter = function getAdminRouter(server) {
	const router = createRouter();

	server.log.debug({
		event: 'ROUTES_INITIALIZED',
		message: 'Admin routes initialized'
	});

	// The admin panel requires sessions to be set up
	router.use(server.sessionMiddleware);

	// Get user auth details
	router.use((request, response, next) => {
		// @ts-ignore
		const userId = request.session.userId;
		const isAuthenticated = Boolean(userId);
		response.locals.isAuthenticated = isAuthenticated;
		response.locals.userId = userId || null;
		next();
	});

	// Login page
	mountLoginRoutes(router, server);

	// Require authentication for further routes
	router.use((request, response, next) => {
		if (!response.locals.isAuthenticated) {
			return response.redirect(`${request.baseUrl}/login`);
		}
		next();
	});

	// Dashboard
	mountDashboardRoutes(router, server);
	mountPageRoutes(router, server);

	return router;
};
