'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms create:migration')
	.argument('<name>', 'the migration name')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.description('create a database migration')
	.action(async (name, {directory}) => {
		try {
			const config = loadConfig(directory);
			const dataStore = new DataStore(config);
			await dataStore.createMigration(name);
			await dataStore.disconnect();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
