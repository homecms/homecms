'use strict';

const config = require('@indieweb-cms/config');
const {program} = require('commander');
const {Server} = require('@indieweb-cms/server');

// Program options
program
	.name('indieweb-cms start')
	.description('run the server')
	.action(async () => {
		try {
			const server = new Server(config);
			await server.start();
		} catch (error) {
			config.logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
