'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@indieweb-cms/logger', () => {
	let logger;
	let pino;

	beforeEach(() => {

		td.replace('pino', {
			pino: td.func()
		});
		pino = require('pino').pino;
		td.when(pino(), {ignoreExtraArgs: true}).thenReturn('mock-pino-logger');

		logger = require('../../..');
	});

	it('creates a pino logger', () => {
		td.verify(pino({
			base: {},
			errorKey: 'error',
			formatters: {
				level: td.matchers.isA(Function)
			},
			messageKey: 'message'
		}), {times: 1});

		const levelFormatter = td.explain(pino).calls[0].args[0].formatters.level;
		assert.deepEqual(levelFormatter('what'), {level: 'what'});
	});

	it('exports the pino logger', () => {
		assert.strictEqual(logger, 'mock-pino-logger');
	});

});
