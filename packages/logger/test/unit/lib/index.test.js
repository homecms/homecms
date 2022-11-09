'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@indieweb-cms/logger', () => {
	let createLogger;
	let pino;

	beforeEach(() => {

		td.replace('pino', {
			pino: td.func()
		});
		pino = require('pino').pino;
		// eslint-disable-next-line id-denylist
		pino.stdSerializers = {err: 'mock-error-serializer'};
		td.when(pino(), {ignoreExtraArgs: true}).thenReturn('mock-pino-logger');

		createLogger = require('../../..').createLogger;
	});

	describe('.createLogger(options)', () => {
		let logger;

		beforeEach(() => {
			logger = createLogger({
				level: 'mock-log-level'
			});
		});

		it('creates a pino logger', () => {
			td.verify(pino({
				base: {},
				errorKey: 'error',
				formatters: {
					level: td.matchers.isA(Function)
				},
				level: 'mock-log-level',
				messageKey: 'message',
				serializers: {
					error: 'mock-error-serializer'
				}
			}), {times: 1});

			const levelFormatter = td.explain(pino).calls[0].args[0].formatters.level;
			assert.deepEqual(levelFormatter('what'), {level: 'what'});
		});

		it('returns the pino logger', () => {
			assert.strictEqual(logger, 'mock-pino-logger');
		});

		describe('when `options.pretty` is `true`', () => {

			beforeEach(() => {
				logger = createLogger({
					level: 'mock-log-level',
					pretty: true
				});
			});

			it('creates a pino logger with prettification', () => {
				td.verify(pino({
					base: {},
					errorKey: 'error',
					formatters: {
						level: td.matchers.isA(Function)
					},
					level: 'mock-log-level',
					messageKey: 'message',
					serializers: {
						error: 'mock-error-serializer'
					},
					transport: {
						target: 'pino-pretty',
						options: {
							messageKey: 'message'
						}
					}
				}), {times: 1});
			});

			it('returns the pino logger', () => {
				assert.strictEqual(logger, 'mock-pino-logger');
			});

		});

	});

});
