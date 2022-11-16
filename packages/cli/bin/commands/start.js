'use strict';

const {loadConfig} = require('@homecms/config');
const {program} = require('commander');
const {Server} = require('@homecms/server');

// Program options
program
	.name('homecms start')
	.description('run the server')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.action(async ({directory}) => {
		try {
			const config = loadConfig(directory);
			const server = new Server(config);
			await server.start();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
