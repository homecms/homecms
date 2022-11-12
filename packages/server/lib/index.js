'use strict';

const {createServer} = require('node:http');
const {DataStore} = require('@indieweb-cms/data');
const express = require('express');
const {promisify} = require('node:util');

/**
 * @typedef {object} ServerConfig
 * @property {string} baseURL - Base URL of the locally running app.
 * @property {'ci' | 'development' | 'production'} environment - Environment the CMS will run on.
 * @property {import('@indieweb-cms/logger')} logger - The logger to use.
 * @property {number} port - HTTP port that the CMS will run on.
 */

/**
 * Class representing a server.
 */
exports.Server = class Server {

	/**
	 * @type {import('express').Express}
	 */
	#app;

	/**
	 * @type {string}
	 */
	#baseURL;

	/**
	 * @type {DataStore}
	 */
	#dataStore;

	/**
	 * @type {string}
	 */
	#environment;

	/**
	 * @type {import('node:http').Server}
	 */
	#httpServer;

	/**
	 * @type {Function}
	 */
	#httpServerClose;

	/**
	 * @type {Function}
	 */
	#httpServerListen;

	/**
	 * @type {import('@indieweb-cms/logger').Logger}
	 */
	#log;

	/**
	 * @type {number}
	 */
	#port;

	/**
	 * Server constructor.
	 *
	 * @param {ServerConfig & import('@indieweb-cms/data').DataStoreConfig} config - The server configuration.
	 */
	constructor({baseURL, databaseURL, environment, logger, port}) {
		this.#baseURL = baseURL;
		this.#environment = environment;
		this.#log = logger;
		this.#port = port;

		// Initialise the data store
		this.#dataStore = new DataStore({
			databaseURL,
			logger
		});

		// Create the app and server
		this.#app = express();
		this.#httpServer = createServer(this.#app);
		this.#httpServerClose = promisify(this.#httpServer.close.bind(this.#httpServer));
		this.#httpServerListen = promisify(this.#httpServer.listen.bind(this.#httpServer));

		// Initialise routes
		this.#initialiseRoutes();
	}

	/**
	 * Initialise the app routes.
	 */
	#initialiseRoutes() {
		const {models} = this.#dataStore;

		this.#app.get('/__system/health', (request, response) => {
			response.status(200).send({ok: true});
		});

		// Declare the main content route
		this.#app.get(/.*/, async (request, response, next) => {

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

	}

	/**
	 * Start the server.
	 *
	 * @returns {Promise<void>} - Resolves when the server has been started.
	 */
	async start() {
		await this.#httpServerListen(this.#port);
		this.#log.info({
			event: 'SERVER_STARTED',
			message: 'Server is ready to accept connections',
			baseURL: this.#baseURL,
			environment: this.#environment
		});
	}

	/**
	 * Stop the server.
	 *
	 * @returns {Promise<void>} - Resolves when the server has been stopped.
	 */
	async stop() {
		await this.#httpServerClose();
		await this.#dataStore.disconnect();
	}

};
