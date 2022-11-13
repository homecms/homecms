'use strict';

const {createServer} = require('node:http');
const {DataStore} = require('@indieweb-cms/data');
const express = require('express');
const {promisify} = require('node:util');
const {getSystemRouter} = require('../routes/system');
const {getPagesRouter} = require('../routes/pages');

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
		this.#app.use(getSystemRouter(this));
		this.#app.use(getPagesRouter(this));
	}

	/**
	 * Get the environment the server is running in.
	 *
	 * @returns {string} - Returns the current environment.
	 */
	get environment() {
		return this.#environment;
	}

	/**
	 * Get the data store models for the server.
	 *
	 * @returns {import('@indieweb-cms/data').DataModels} - Returns the models.
	 */
	get models() {
		return this.#dataStore.models;
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
