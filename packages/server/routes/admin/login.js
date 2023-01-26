'use strict';

const {urlencoded} = require('express');

/**
 * Mount the login routes for the admin panel.
 *
 * @param {import('express').Router} adminRouter - The admin router.
 * @param {import('../../lib/index').Server} server - The server to add admin routes to.
 * @returns {void}
 */
exports.mountLoginRoutes = function mountLoginRoutes(adminRouter, server) {
	const {models} = server;

	adminRouter.route('/login')
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
						const loginUrl = `${server.baseURL}${request.originalUrl}?token=${token.id}`;
						server.mailer
							.sendMail({
								to: user.email,
								subject: 'Login',
								text: `Follow the link to log in:\n${loginUrl}`
							})
							.then(() => {
								server.log.debug({
									event: 'LOGIN_EMAIL_SENT',
									message: `Successfully sent login email to email: "${email}"`
								});
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
};
