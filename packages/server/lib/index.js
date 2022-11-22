'use strict';

const {createMailer} = require('@homecms/mailer');
const {createServer} = require('node:http');
const {DataStore} = require('@homecms/data');
const express = require('express');
const {getSystemRouter} = require('../routes/system');
const {getPagesRouter} = require('../routes/pages');
const {default: helmet} = require('helmet');
const {Liquid} = require('liquidjs');
const notFound = require('@rowanmanning/not-found');
const {promisify} = require('node:util');
const {redirectToHTTPS} = require('express-http-to-https');
const renderErrorPage = require('@rowanmanning/render-error-page');
const {ThemeManager} = require('@homecms/themer');

/**
 * @typedef {object} ServerConfig
 * @property {string} baseURL - Base URL of the locally running app.
 * @property {'ci' | 'development' | 'production'} environment - Environment the CMS will run on.
 * @property {import('@homecms/logger').Logger} logger - The logger to use.
 * @property {number} port - HTTP port that the CMS will run on.
 * @property {string} theme - HTTP theme that the CMS will use.
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
	 * @type {import('@homecms/logger').Logger}
	 */
	#log;

	/**
	 * @type {import('@homecms/mailer').Mailer}
	 */
	#mailer;

	/**
	 * @type {number}
	 */
	#port;

	/**
	 * @type {import('liquidjs').Liquid}
	 */
	#viewEngine;

	/**
	 * @type {string}
	 */
	#theme;

	/**
	 * @type {ThemeManager}
	 */
	#themeManager;

	/**
	 * Server constructor.
	 *
	 * @param {ServerConfig & import('@homecms/data').DataStoreConfig & import('@homecms/mailer').MailerConfig} config - The server configuration.
	 */
	constructor({
		baseURL,
		databaseURL,
		emailConnectionURL,
		emailFromAddress,
		environment,
		logger,
		port,
		theme
	}) {
		this.#baseURL = baseURL;
		this.#environment = environment;
		this.#log = logger;
		this.#port = port;
		this.#theme = theme;

		// Initialise the data store
		this.#dataStore = new DataStore({
			databaseURL,
			logger
		});

		// Initialise the mailer
		this.#mailer = createMailer({
			emailConnectionURL,
			emailFromAddress
		});

		// Create the app and server
		const app = this.#app = express();
		this.#httpServer = createServer(app);
		this.#httpServerClose = promisify(this.#httpServer.close.bind(this.#httpServer));
		this.#httpServerListen = promisify(this.#httpServer.listen.bind(this.#httpServer));

		// Configure default routing behaviour
		app.enable('case sensitive routing');
		app.enable('strict routing');

		// Configure JSON output
		app.set('json spaces', '\t');

		// Remove x-powered-by header
		app.disable('x-powered-by');

		// Set the trust proxy settings
		app.set('trust proxy', true);

		// Set up default view data
		app.locals.language = 'en';

		// Get theme details
		this.#themeManager = new ThemeManager({
			themeNames: [
				this.#theme,
				'@homecms/theme-base'
			],
			logger: this.#log
		});

		// Set up the view engine
		const themeViewPaths = this.#themeManager.themes.map(({viewPath}) => viewPath);
		this.#viewEngine = new Liquid({
			cache: this.#environment === 'production',
			extname: '.liquid'
		});
		app.engine('liquid', this.#viewEngine.express());
		app.set('views', themeViewPaths);
		app.set('view engine', 'liquid');

		// Set up pre-route middleware
		app.use(helmet());
		app.use(redirectToHTTPS([/^localhost:\d+$/i]));

		// Initialise routes
		this.#initialiseRoutes();

		// Set up post-route middleware
		app.use(notFound());
		app.use((error, request, response, next) => {
			if (!error.status || error.status !== 404) {
				this.#log.error(error);
			}
			next(error);
		});
		app.use(renderErrorPage());
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
	 * Get the mailer for the server.
	 *
	 * @returns {import('@homecms/mailer').Mailer} - Returns the mailer.
	 */
	get mailer() {
		return this.#mailer;
	}

	/**
	 * Get the data store models for the server.
	 *
	 * @returns {import('@homecms/data').DataModels} - Returns the models.
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
