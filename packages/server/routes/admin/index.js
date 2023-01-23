'use strict';

const {Router: createRouter, urlencoded} = require('express');

/**
 * Get a router for admin routes.
 *
 * @param {import('../../lib/index').Server} server - The server to add admin routes to.
 * @returns {import('express').Router} - Returns the admin router.
 */
exports.getAdminRouter = function getAdminRouter(server) {
	const {models} = server;
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
	router.route('/login')
		.all((request, response, next) => {
			if (response.locals.isAuthenticated) {
				return response.redirect(request.baseUrl);
			}
			next();
		})
		.get(async (request, response, next) => {
			try {
				if (typeof request.query.token === 'string') {
					const user = await models.user.findOneByLoginToken(request.query.token);
					if (user) {
						await models.user.deleteLoginToken(request.query.token);
						// @ts-ignore
						// eslint-disable-next-line require-atomic-updates
						request.session.userId = user.id;
						return request.session.save(error => {
							if (error) {
								return next(error);
							}
							response.redirect(request.baseUrl);
						});
					}
				}
				response.render('admin/login');
			} catch (error) {
				next(error);
			}
		})
		.post(urlencoded({extended: false}), async (request, response, next) => {
			try {
				const email = request.body.email;
				const user = await models.user.findOneByEmail(email);
				if (user) {
					const token = await models.user.createLoginToken(user.id);
					if (token) {
						const loginPath = request.originalUrl.replace(/^\//, '');
						const loginUrl = `${server.baseURL}${loginPath}?token=${token.id}`;
						server.mailer
							.sendMail({
								to: user.email,
								subject: 'Login',
								text: `Follow the link to log in:\n${loginUrl}`
							})
							.catch(error => {
								server.log.error({
									event: 'LOGIN_EMAIL_FAILED',
									message: `Failed to send the login email: ${error.message}`
								});
							});
					}
				} else {
					server.log.warn({
						event: 'LOGIN_EMAIL_INVALID',
						message: `Attempt to log in with an invalid email: "${email}"`
					});
				}
				response.render('admin/login', {
					loginForm: {
						email: request.body.email,
						success: true
					}
				});
			} catch (error) {
				next(error);
			}
		});

	// Require authentication for further routes
	router.use((request, response, next) => {
		if (!response.locals.isAuthenticated) {
			return response.redirect(`${request.baseUrl}/login`);
		}
		next();
	});

	// Render the admin dashboard
	router.get('/', (request, response) => {
		response.render('admin/dashboard');
	});

	return router;
};
