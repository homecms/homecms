'use strict';

const config = require('@homecms/config');
const {program} = require('commander');
const {Server} = require('@homecms/server');

// Program options
program
	.name('homecms start')
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
