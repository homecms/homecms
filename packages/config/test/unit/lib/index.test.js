'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@homecms/config', () => {
	let createLogger;
	let loadConfig;
	let mockLogger;
	let originalEnv;
	let requireFirst;

	beforeEach(() => {
		mockLogger = {warn: td.func()};
		td.replace('@homecms/logger', {createLogger: td.func()});
		createLogger = require('@homecms/logger').createLogger;
		td.when(createLogger(), {ignoreExtraArgs: true}).thenReturn(mockLogger);

		td.replace('@rowanmanning/require-first', td.func());
		requireFirst = require('@rowanmanning/require-first');

		originalEnv = process.env;
		process.env = {
			CI: undefined,
			DATABASE_URL: undefined,
			LOG_LEVEL: undefined,
			NODE_ENV: undefined,
			PORT: undefined
		};

		loadConfig = require('../../..').loadConfig;
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	describe('.createLogger(baseDirectory)', () => {
		let config;

		describe('with no environment variables and no config file', () => {

			beforeEach(() => {
				td.when(requireFirst(), {ignoreExtraArgs: true}).thenReturn(false);
				config = loadConfig('/mock-base-directory');
			});

			it('attempts to load a config file', () => {
				td.verify(requireFirst([
					'/mock-base-directory/homecms.config.js',
					'/mock-base-directory/homecms.config.json',
					'/mock-base-directory/homecms.js',
					'/mock-base-directory/homecms.json'
				], false), {times: 1});
			});

			it('creates a new logger with a log level of "info" and prettification on', () => {
				td.verify(createLogger({
					level: 'info',
					pretty: true
				}), {times: 1});
			});

			it('logs that the config file was not found', () => {
				td.verify(mockLogger.warn('Home CMS config file not found in /mock-base-directory'), {times: 1});
			});

			it('is a frozen object', () => {
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
					assert.strictEqual(config.databaseURL, 'postgresql://localhost/homecms');
				});
			});

			describe('.environment', () => {
				it('is set to "development"', () => {
					assert.strictEqual(config.environment, 'development');
				});
			});

			describe('.logger', () => {
				it('is set to the created logger', () => {
					assert.strictEqual(config.logger, mockLogger);
				});
			});

			describe('.logLevel', () => {
				it('is set to the default log level', () => {
					assert.strictEqual(config.logLevel, 'info');
				});
			});

			describe('.port', () => {
				it('is set to a default port', () => {
					assert.strictEqual(config.port, 3000);
				});
			});

			describe('.theme', () => {
				it('is set to a default theme', () => {
					assert.strictEqual(config.theme, '@homecms/theme-limelight');
				});
			});

		});

		describe('when `baseDirectory` is not defined', () => {

			beforeEach(() => {
				td.replace(process, 'cwd', () => '/mock-cwd');
				td.when(requireFirst(), {ignoreExtraArgs: true}).thenReturn(false);
				config = loadConfig();
			});

			it('attempts to load a config file relative to the current working directory', () => {
				td.verify(requireFirst([
					'/mock-cwd/homecms.config.js',
					'/mock-cwd/homecms.config.json',
					'/mock-cwd/homecms.js',
					'/mock-cwd/homecms.json'
				], false), {times: 1});
			});

		});

		describe('with environment variables', () => {

			beforeEach(() => {
				td.when(requireFirst(), {ignoreExtraArgs: true}).thenReturn(false);
			});

			describe('with a `DATABASE_URL` environment variable', () => {

				beforeEach(() => {
					process.env.DATABASE_URL = 'mock-database-url';
					config = loadConfig('/mock-base-directory');
				});

				describe('.databaseURL', () => {
					it('is set to the value of the environment variable', () => {
						assert.strictEqual(config.databaseURL, 'mock-database-url');
					});
				});

			});

			describe('with a `LOG_LEVEL` environment variable', () => {

				beforeEach(() => {
					process.env.LOG_LEVEL = 'mock-log-level';
					config = loadConfig('/mock-base-directory');
				});

				it('creates a new logger with a log level set to the environment variable', () => {
					td.verify(createLogger({
						level: 'mock-log-level',
						pretty: true
					}), {times: 1});
				});

				describe('.logLevel', () => {
					it('is set to the value of the environment variable', () => {
						assert.strictEqual(config.logLevel, 'mock-log-level');
					});
				});

			});

			describe('with a `NODE_ENV` environment variable', () => {

				describe('set to "production"', () => {

					beforeEach(() => {
						process.env.NODE_ENV = 'production';
						config = loadConfig('/mock-base-directory');
					});

					it('creates a new logger with a log level of "info" and prettification off', () => {
						td.verify(createLogger({
							level: 'info',
							pretty: false
						}), {times: 1});
					});

					describe('.environment', () => {
						it('is set to the value of the environment variable', () => {
							assert.strictEqual(config.environment, 'production');
						});
					});

				});

				describe('set to an invalid value', () => {

					beforeEach(() => {
						process.env.NODE_ENV = 'test';
						config = loadConfig('/mock-base-directory');
					});

					describe('.environment', () => {
						it('is set to "development"', () => {
							assert.strictEqual(config.environment, 'development');
						});
					});

				});

			});

			describe('with a `CI` environment variable', () => {

				beforeEach(() => {
					process.env.CI = 'true';
				});

				describe('with no `NODE_ENV` environment variable', () => {

					beforeEach(() => {
						process.env.NODE_ENV = 'development';
						config = loadConfig('/mock-base-directory');
					});

					describe('.environment', () => {
						it('is set to "ci"', () => {
							assert.strictEqual(config.environment, 'ci');
						});
					});

				});

				describe('with a `NODE_ENV` environment variable', () => {

					describe('set to "production"', () => {

						beforeEach(() => {
							process.env.NODE_ENV = 'production';
							config = loadConfig('/mock-base-directory');
						});

						describe('.environment', () => {
							it('is set to the value of the environment variable', () => {
								assert.strictEqual(config.environment, 'production');
							});
						});

					});

					describe('set to "development"', () => {

						beforeEach(() => {
							process.env.NODE_ENV = 'development';
							config = loadConfig('/mock-base-directory');
						});

						describe('.environment', () => {
							it('is set to "ci"', () => {
								assert.strictEqual(config.environment, 'ci');
							});
						});

					});

					describe('set to an invalid value', () => {

						beforeEach(() => {
							process.env.NODE_ENV = 'test';
							config = loadConfig('/mock-base-directory');
						});

						describe('.environment', () => {
							it('is set to "ci"', () => {
								assert.strictEqual(config.environment, 'ci');
							});
						});

					});

				});

			});

			describe('with a `PORT` environment variable', () => {

				beforeEach(() => {
					process.env.PORT = '1234';
					config = loadConfig('/mock-base-directory');
				});

				describe('.baseURL', () => {
					it('is set to localhost with the configured port', () => {
						assert.strictEqual(config.baseURL, 'http://localhost:1234/');
					});
				});

				describe('.port', () => {
					it('is set to the value of the environment variable cast to a number', () => {
						assert.strictEqual(config.port, 1234);
					});
				});

			});

		});

		describe('with a config file', () => {
			let configFile;

			beforeEach(() => {
				configFile = {
					baseURL: 'mock-base-url',
					databaseURL: 'mock-database-url',
					environment: 'mock-environment',
					logger: 'mock-logger',
					logLevel: 'mock-log-level',
					port: 'mock-port',
					theme: 'mock-theme'
				};
				td.when(requireFirst(), {ignoreExtraArgs: true}).thenReturn(configFile);
			});

			describe('base', () => {

				beforeEach(() => {
					config = loadConfig('/mock-base-directory');
				});

				it('does not log that the config file was not found', () => {
					td.verify(mockLogger.warn(), {
						ignoreExtraArgs: false,
						times: 0
					});
				});

				describe('.baseURL', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.baseURL, 'mock-base-url');
					});
				});

				describe('.databaseURL', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.databaseURL, 'mock-database-url');
					});
				});

				describe('.environment', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.environment, 'mock-environment');
					});
				});

				describe('.logger', () => {
					it('is set to the created logger rather than the configured value', () => {
						assert.strictEqual(config.logger, mockLogger);
					});
				});

				describe('.logLevel', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.logLevel, 'mock-log-level');
					});
				});

				describe('.port', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.port, 'mock-port');
					});
				});

				describe('.theme', () => {
					it('is set to the configured value', () => {
						assert.strictEqual(config.theme, 'mock-theme');
					});
				});

			});

			describe('when the `port` configuration is set but `baseURL` is not', () => {

				beforeEach(() => {
					delete configFile.baseURL;
					config = loadConfig('/mock-base-directory');
				});

				it('does not log that the config file was not found', () => {
					td.verify(mockLogger.warn(), {
						ignoreExtraArgs: false,
						times: 0
					});
				});

				describe('.baseURL', () => {
					it('is set to localhost with the configured port', () => {
						assert.strictEqual(config.baseURL, 'http://localhost:mock-port/');
					});
				});

			});

		});

	});

});
