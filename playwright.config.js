'use strict';

const {devices} = require('@playwright/test');
const {loadConfig} = require('@homecms/config');

const endToEndServerDirectory = './test/end-to-end/server';
const {baseURL, databaseURL, environment, port} = loadConfig(endToEndServerDirectory);
const isCi = environment === 'ci';

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */
module.exports = {
	testDir: './test/end-to-end',
	outputDir: 'test/output/playwright-results', // Test artifacts (screenshots, videos, traces)

	// Wait 30 seconds max for each test
	// Wait 5 seconds max for each expect call
	timeout: 30 * 1000,
	expect: {timeout: 5 * 1000},

	// Run tests in files in parallel
	fullyParallel: true,

	// Config that changes between local and CI
	forbidOnly: isCi, // Fail the build on CI if test.only is present
	retries: isCi ? 2 : 0, // Retry tests twice in CI
	workers: isCi ? 1 : undefined, // Opt out of parallel tests on CI

	// Reporter to use (https://playwright.dev/docs/test-reporters)
	reporter: [
		[isCi ? 'github' : 'list'],
		['html', {outputFolder: 'test/output/playwright-html'}]
	],

	// Configurations for the web server to run for the tests
	webServer: {
		env: {
			...process.env,
			PORT: port,
			DATABASE_URL: databaseURL
		},
		command: [
			'npm run migrate:latest',
			'npm run seed clean',
			'npm run seed test',
			`npm start -- --directory "${endToEndServerDirectory}"`
		].join(' && '),
		url: `${baseURL}__system/health`,
		timeout: 1 * 60 * 1000, // Wait 1 minute for the server to start
		reuseExistingServer: false
	},

	// Shared settings for all defined projects (https://playwright.dev/docs/api/class-testoptions)
	use: {
		actionTimeout: 0, // No limit on how long each action can take
		baseURL, // Base URL to use in actions when a relative URL is used
		trace: 'on-first-retry' // Collect a trace when retrying (https://playwright.dev/docs/trace-viewer)
	},

	// Configure projects (the different browsers we run in)
	projects: [

		// Chromium desktop - all we need for now.
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome']
			}
		}

	]
};
