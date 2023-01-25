'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const path = require('node:path');
const {Server} = require('@homecms/server');
const {default: puppeteer} = require('puppeteer');

/**
 * @typedef {object} TestSuite
 * @property {string} baseURL - The base URL of the running test server.
 * @property {import('puppeteer').Browser} browser - A Puppeteer browser configured for testing.
 * @property {import('@homecms/config').Config} config - The test suite app configuration.
 * @property {import('@homecms/data').DataStore} dataStore - A datastore for managing test data.
 * @property {import('@homecms/server').Server} server - The running test server.
 */

/**
 * @typedef {object} TestSuiteCache
 * @property {TestSuite} [suite] - The cached test suite.
 */

const TEST_SERVER_DIRECTORY = path.resolve(__dirname, 'server');
const SEED_DATA_DIRECTORY = path.resolve(__dirname, '..', 'seed-data');
const MAIN_SEED_DATA_DIRECTORY = path.join(SEED_DATA_DIRECTORY, 'main');

/**
 * @type {TestSuiteCache}
 */
const cache = {};

/**
 * @returns {TestSuite} - Returns the running test suite.
 */
exports.suite = function suite() {
	if (!cache.suite) {
		throw new Error('Test suite has not been started yet');
	}
	return cache.suite;
};

/**
 * @returns {Promise<TestSuite>} - Returns the started test suite.
 */
exports.start = async function start() {
	const suite = {};

	suite.config = loadConfig(TEST_SERVER_DIRECTORY);

	// Set up a datastore and server
	suite.dataStore = new DataStore(suite.config);
	suite.server = new Server(suite.config);

	// Migrate the database and seed it with test data
	await suite.dataStore.migrateToLatest();
	await suite.dataStore.addSeedData('clean');
	await suite.dataStore.addSeedData(MAIN_SEED_DATA_DIRECTORY);

	// Start the test server
	await suite.server.start();
	suite.baseURL = `http://localhost:${suite.server.port}`;

	// Set up a Puppeteer browser for testing
	suite.browser = await puppeteer.launch();

	cache.suite = suite;
	return suite;
};

exports.stop = async function stop() {
	if (cache.suite) {
		const suite = cache.suite;
		await Promise.all([
			suite.dataStore.disconnect(),
			suite.server.stop(),
			suite.browser.close()
		]);
	}
};

exports.auth = require('./auth');
exports.browser = require('./browser');
exports.database = require('./database');
exports.http = require('./http');
