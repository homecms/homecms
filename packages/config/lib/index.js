'use strict';

const {createLogger} = require('@homecms/logger');
const dotenv = require('dotenv');
const path = require('node:path');
const {randomBytes} = require('node:crypto');
const requireFirst = require('@rowanmanning/require-first');

/**
 * @typedef {'ci' | 'development' | 'production'} Environment
 */

/**
 * @typedef {object} Config
 * @property {string} [baseURL] - The base URL for the app where requests to the home page should be routed. Defaults to localhost with the `port` configuration.
 * @property {string} [databaseURL] - The PostgreSQL database connection string. Defaults to the `DATABASE_URL` environment variable or "postgresql://localhost/homecms-dev".
 * @property {string | false} [emailConnectionURL] - Email connection details. Defaults to `false` which will fall back to the `sendmail` command.
 * @property {string} [emailFromAddress] - The email address system emails will be sent from.
 * @property {Environment} [environment] - The environment the CMS is running in. Defaults to the `NODE_ENV` environment variable.
 * @property {string} [logLevel] - The level to output logs at. Defaults to the `LOG_LEVEL` environment variable or "info".
 * @property {number} [port] - The HTTP port the CMS will run on. Defaults to the `PORT` environment variable.
 * @property {string} [sessionSecret] - The secret to encrypt session data with. Defaults to the `SESSION_SECRET` environment variable or a random string.
 * @property {string} [theme] - The theme the CMS will use. Defaults to "@homecms/theme-limelight".
 */

/**
 * @typedef {object} DefaultedConfig
 * @property {string} baseURL - The base URL for the app.
 * @property {string} databaseURL - The PostgreSQL database connection string.
 * @property {string | false} emailConnectionURL - Email connection details.
 * @property {string} emailFromAddress - The email address system emails will be sent from.
 * @property {Environment} environment - The environment.
 * @property {import('@homecms/logger').Logger} logger - The app logger.
 * @property {string} logLevel - The level to output logs at.
 * @property {number} port - The HTTP port the CMS will run on.
 * @property {string} sessionSecret - The secret to encrypt session data with.
 * @property {string} theme - The theme the CMS will use.
 */

dotenv.config();

/**
 * @type {Array<string>}
 */
const configFileNames = [
	'homecms.config.js',
	'homecms.config.json',
	'homecms.js',
	'homecms.json'
];

/**
 * Load config from the file system.
 *
 * @param {string} [baseDirectory] - The directory to look for a config file in.
 * @returns {DefaultedConfig} - Resolves with the created config.
 */
exports.loadConfig = function loadConfig(baseDirectory = process.cwd()) {

	// Load the config file
	const paths = configFileNames.map(configFile => path.resolve(baseDirectory, configFile));
	const configFile = requireFirst(paths, false);

	/**
	 * @type {Environment}
	 */
	let defaultEnvironment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
	if (defaultEnvironment === 'development' && process.env.CI) {
		defaultEnvironment = 'ci';
	}

	/**
	 * @type {DefaultedConfig}
	 */
	const config = Object.assign({
		databaseURL: process.env.DATABASE_URL || 'postgresql://localhost/homecms',
		emailConnectionURL: process.env.EMAIL_CONNECTION_URL || false,
		emailFromAddress: process.env.EMAIL_FROM_ADDRESS || 'system@homecms',
		environment: defaultEnvironment,
		logLevel: process.env.LOG_LEVEL || 'info',
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
		sessionSecret: process.env.SESSION_SECRET || randomBytes(24).toString('hex'),
		theme: '@homecms/theme-limelight'
	}, configFile);

	// Set a default base URL
	if (!config.baseURL) {
		config.baseURL = `http://localhost:${config.port}`;
	}

	// Create a logger to add to the final config
	config.logger = createLogger({
		level: config.logLevel,
		pretty: config.environment !== 'production'
	});

	// Log if we couldn't load a config file
	if (configFile === false) {
		config.logger.warn(`Home CMS config file not found in ${baseDirectory}`);
	}

	return Object.freeze(config);
};
