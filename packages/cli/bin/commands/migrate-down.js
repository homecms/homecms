'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:down')
	.argument('[name]', 'the migration to undo (defaults to the most recently applied)')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.description('undo a migration')
	.action(async (name, {directory}) => {
		try {
			const config = loadConfig(directory);
			const dataStore = new DataStore(config);
			await dataStore.migrateDown(name);
			await dataStore.disconnect();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
