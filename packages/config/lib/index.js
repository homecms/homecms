'use strict';

require('dotenv').config();

/**
 * @typedef {object} Config
 * @property {'production' | 'development'} environment - The environment the CMS will run in.
 * @property {number} port - The port that the CMS will run on.
 */

/**
 * @type {Config}
 */
module.exports = Object.freeze({
	environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	port: process.env.PORT ? Number(process.env.PORT) : 3000
});
