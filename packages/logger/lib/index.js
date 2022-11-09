'use strict';

const {pino} = require('pino');

/**
 * @typedef {pino.Logger} Logger
 */

/**
 * @typedef {object} LoggerOptions
 * @property {string} level - The log level to output logs at.
 * @property {boolean} [pretty = false] - Whether to prettify logs.
 */

/**
 * Create a logger.
 *
 * @param {LoggerOptions} options - Logger configuration options.
 * @returns {Logger} - Returns the created Pino logger.
 */
exports.createLogger = function createLogger({level, pretty = false}) {
	const pinoOptions = {
		base: {},
		errorKey: 'error',
		formatters: {
			level(label) {
				return {level: label};
			}
		},
		level,
		messageKey: 'message',
		serializers: {
			error: pino.stdSerializers.err
		}
	};
	if (pretty) {
		pinoOptions.transport = {
			target: 'pino-pretty',
			options: {
				messageKey: 'message'
			}
		};
	}
	return pino(pinoOptions);
};
