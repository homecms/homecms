'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms create:seed')
	.argument('<name>', 'the seed directory name')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.description('create a database seed data')
	.action(async (name, {directory}) => {
		try {
			const config = loadConfig(directory);
			const dataStore = new DataStore(config);
			await dataStore.createSeedData(name);
			await dataStore.disconnect();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
