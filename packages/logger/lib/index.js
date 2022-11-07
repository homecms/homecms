'use strict';

const {pino} = require('pino');

/**
 * @type {pino.Logger}
 */
module.exports = pino({
	base: {},
	errorKey: 'error',
	formatters: {
		level(label) {
			return {level: label};
		}
	},
	messageKey: 'message'
});
