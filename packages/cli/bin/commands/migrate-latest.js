'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:latest')
	.description('run all migrations which have not yet been run')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.action(async ({directory}) => {
		try {
			const config = loadConfig(directory);
			const dataStore = new DataStore(config);
			await dataStore.migrateToLatest();
			await dataStore.disconnect();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
