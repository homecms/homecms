'use strict';

const {createMailer} = require('@homecms/mailer');
const {createServer} = require('node:http');
const {DataStore} = require('@homecms/data');
const express = require('express');
const {getAdminRouter} = require('../routes/admin');
const {getPagesRouter} = require('../routes/pages');
const {getSystemRouter} = require('../routes/system');
const {default: helmet} = require('helmet');
const {Liquid} = require('liquidjs');
const notFound = require('@rowanmanning/not-found');
const {promisify} = require('node:util');
const {redirectToHTTPS} = require('express-http-to-https');
const renderErrorPage = require('@rowanmanning/render-error-page');
const session = require('express-session');
const SessionStore = require('connect-session-knex')(session);
const {ThemeManager} = require('@homecms/themer');

/**
 * @typedef {object} ServerConfig
 * @property {string} baseURL - Base URL of the locally running app.
 * @property {'ci' | 'development' | 'production'} environment - Environment the CMS will run on.
 * @property {import('@homecms/logger').Logger} logger - The logger to use.
 * @property {number} port - HTTP port that the CMS will run on.
 * @property {string} sessionSecret - The secret to encrypt session data with.
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
	 * @type {Object<string, import('express').Handler>}
	 */
	#middleware;

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
		sessionSecret,
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

		// Initalise reusable middleware
		this.#middleware = {

			// TODO question: should this live in a different package?
			// It's tightly coupled to the data module
			session: session({
				cookie: {
					maxAge: 7 * 24 * 60 * 60 * 1_000 // One week
				},
				name: 'HomeCMS.session',
				resave: false,
				rolling: true,
				saveUninitialized: false,
				secret: sessionSecret,
				store: new SessionStore({
					createtable: false,
					knex: this.#dataStore.knex,
					sidfieldname: 'id'
				})
			})
		};

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
				if (error.status < 500) {
					this.#log.warn(error);
				} else {
					this.#log.error(error);
				}
			}
			next(error);
		});
		app.use(renderErrorPage());
	}

	/**
	 * Initialise the app routes.
	 */
	#initialiseRoutes() {
		this.#app.use('/__system', getSystemRouter(this));
		this.#app.use('/__admin', getAdminRouter(this));
		this.#app.use(getPagesRouter(this));
	}

	/**
	 * Get the server's base URL.
	 *
	 * @returns {string} - Returns the base URL.
	 */
	get baseURL() {
		return this.#baseURL;
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
	 * Get the server logger.
	 *
	 * @returns {import('@homecms/logger').Logger} - Returns the server logger.
	 */
	get log() {
		return this.#log;
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
	 * Get the server session middleware.
	 *
	 * @returns {import('express').Handler} - Returns the session middleware.
	 */
	get sessionMiddleware() {
		return this.#middleware.session;
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
