'use strict';

const {devices} = require('@playwright/test');
const config = require('@indieweb-cms/config');

const isCi = config.environment === 'ci';
const port = process.env.PORT || 3456;
const baseURL = `http://localhost:${port}/`;
const databaseURL = process.env.DATABASE_URL || 'postgresql://localhost/indieweb-cms-test';

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
		// TODO we need to drop all tables to do this reliably
		command: 'npm run migrate:latest && npm run seed demo && npm start',
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
		// TODO: add more browsers in nightly tests via environment variables
		{
			name: 'chromium',
			use: {
				...devices['Desktop Chrome']
			}
		}

	]
};
