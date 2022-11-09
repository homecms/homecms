'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@indieweb-cms/config', () => {
	let config;
	let dotenv;
	let originalEnv;

	beforeEach(() => {

		td.replace('dotenv', {
			config: td.func()
		});
		dotenv = require('dotenv');

		originalEnv = process.env;

		process.env = {
			CI: undefined,
			NODE_ENV: undefined,
			PORT: undefined
		};
		config = require('../../..');
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('loads configurations from a .env file', () => {
		td.verify(dotenv.config(), {times: 1});
	});

	it('exports a frozen object', () => {
		assert.throws(() => {
			config.baseURL = 'nope';
		}, TypeError);
	});

	describe('.baseURL', () => {
		it('is set to localhost with a default port', () => {
			assert.strictEqual(config.baseURL, 'http://localhost:3000/');
		});
	});

	describe('.environment', () => {
		it('is set to "development"', () => {
			assert.strictEqual(config.environment, 'development');
		});
	});

	describe('.port', () => {
		it('is set to a default port', () => {
			assert.strictEqual(config.port, 3000);
		});
	});

	describe('when the `CI` environment variable is truthy', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			process.env.CI = 'yes';
			config = require('../../..');
		});

		describe('.environment', () => {
			it('is set to "ci"', () => {
				assert.strictEqual(config.environment, 'ci');
			});
		});

	});

	describe('when the `NODE_ENV` environment variable is set to "production"', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			process.env.NODE_ENV = 'production';
			config = require('../../..');
		});

		describe('.environment', () => {
			it('is set to "production"', () => {
				assert.strictEqual(config.environment, 'production');
			});
		});

		describe('when the `CI` environment variable is truthy', () => {

			beforeEach(() => {
				td.reset();
				td.replace('dotenv', {config: td.func()});
				process.env.CI = 'yes';
				config = require('../../..');
			});

			describe('.environment', () => {
				it('is set to "production"', () => {
					assert.strictEqual(config.environment, 'production');
				});
			});

		});

	});

	describe('when the `NODE_ENV` environment variable is set to an unknown value', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			process.env.NODE_ENV = 'test';
			config = require('../../..');
		});

		describe('.environment', () => {
			it('is set to "development"', () => {
				assert.strictEqual(config.environment, 'development');
			});
		});

	});

	describe('when the `PORT` environment variable is set', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			process.env.PORT = '1234';
			config = require('../../..');
		});

		describe('.baseURL', () => {
			it('is set to localhost with the configured port', () => {
				assert.strictEqual(config.baseURL, 'http://localhost:1234/');
			});
		});

		describe('.port', () => {
			it('is set to the configured port as a number', () => {
				assert.strictEqual(config.port, 1234);
			});
		});

	});

});
