'use strict';

require('dotenv').config();

/**
 * @typedef {object} Config
 * @property {string} baseURL - Base URL of the locally running app.
 * @property {'ci' | 'development' | 'production'} environment - Environment the CMS will run on.
 * @property {number} port - HTTP port that the CMS will run on.
 */

// Work out what environment we're running in
let environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
if (environment === 'development' && process.env.CI) {
	environment = 'ci';
}

// Work out the HTTP port and base URL
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const baseURL = `http://localhost:${port}/`;

/**
 * @type {Config}
 */
module.exports = Object.freeze({
	baseURL,
	environment,
	port
});
