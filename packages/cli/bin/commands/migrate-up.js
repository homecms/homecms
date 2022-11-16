'use strict';

const {DataStore} = require('@homecms/data');
const {loadConfig} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:up')
	.argument('[name]', 'the migration to apply (defaults to the next unapplied)')
	.option('-d, --directory <dir>', 'the directory to look for a config file in', process.cwd())
	.description('apply a migration')
	.action(async (name, {directory}) => {
		try {
			const config = loadConfig(directory);
			const dataStore = new DataStore(config);
			await dataStore.migrateUp(name);
			await dataStore.disconnect();
		} catch (/** @type {any} */ error) {
			console.log(error.stack);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
