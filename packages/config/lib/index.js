'use strict';

const {createLogger} = require('@indieweb-cms/logger');

require('dotenv').config();

// Work out the database URL
const databaseURL = process.env.DATABASE_URL || 'postgresql://localhost/indieweb-cms';

// Work out what environment we're running in
let environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
if (environment === 'development' && process.env.CI) {
	environment = 'ci';
}

// Work out the HTTP port and base URL
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseURL = `http://localhost:${port}/`;

// Work out whether we can/should prettify logs
const doPrettyLogs = environment !== 'production';

// Create a logger and pass through the log level
const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info', // TODO base on environment?
	pretty: doPrettyLogs
});

/**
 * @type {import('@indieweb-cms/data').DataStoreConfig & import('@indieweb-cms/server').ServerConfig}
 */
module.exports = Object.freeze({
	baseURL,
	databaseURL,
	environment,
	logger,
	port
});
