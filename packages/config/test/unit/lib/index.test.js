'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@indieweb-cms/config', () => {
	let config;
	let createLogger;
	let dotenv;
	let originalEnv;

	beforeEach(() => {

		td.replace('dotenv', {
			config: td.func()
		});
		dotenv = require('dotenv');

		td.replace('@indieweb-cms/logger', {
			createLogger: td.func()
		});
		createLogger = require('@indieweb-cms/logger').createLogger;
		td.when(createLogger(), {ignoreExtraArgs: true}).thenReturn('mock-logger');

		originalEnv = process.env;

		process.env = {
			CI: undefined,
			DATABASE_URL: undefined,
			LOG_LEVEL: undefined,
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

	it('creates a new logger with a log level of "info" and prettification on', () => {
		td.verify(createLogger({
			level: 'info',
			pretty: true
		}), {times: 1});
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

	describe('.databaseURL', () => {
		it('is set to a default PostgreSQL connection string', () => {
			assert.strictEqual(config.databaseURL, 'postgresql://localhost/indieweb-cms');
		});
	});

	describe('.environment', () => {
		it('is set to "development"', () => {
			assert.strictEqual(config.environment, 'development');
		});
	});

	describe('.logger', () => {
		it('is set to the created logger', () => {
			assert.strictEqual(config.logger, 'mock-logger');
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

	describe('when the `DATABASE_URL` environment variable is set', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			process.env.DATABASE_URL = 'mock-database-url';
			config = require('../../..');
		});

		describe('.databaseURL', () => {
			it('is set to the configured database URL', () => {
				assert.strictEqual(config.databaseURL, 'mock-database-url');
			});
		});

	});

	describe('when the `LOG_LEVEL` environment variable is set', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			td.replace('@indieweb-cms/logger', {createLogger: td.func()});
			createLogger = require('@indieweb-cms/logger').createLogger;
			process.env.LOG_LEVEL = 'mock-log-level';
			config = require('../../..');
		});

		it('creates a new logger with the specified log level', () => {
			td.verify(createLogger({
				level: 'mock-log-level',
				pretty: true
			}), {times: 1});
		});

	});

	describe('when the `NODE_ENV` environment variable is set to "production"', () => {

		beforeEach(() => {
			td.reset();
			td.replace('dotenv', {config: td.func()});
			td.replace('@indieweb-cms/logger', {createLogger: td.func()});
			createLogger = require('@indieweb-cms/logger').createLogger;
			process.env.NODE_ENV = 'production';
			config = require('../../..');
		});

		it('creates a new logger with a log level of "info" and prettification off', () => {
			td.verify(createLogger({
				level: 'info',
				pretty: false
			}), {times: 1});
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
