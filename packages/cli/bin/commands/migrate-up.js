'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:up')
	.argument('[name]', 'the migration to apply (defaults to the next unapplied)')
	.description('apply a migration')
	.action(async name => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.migrateUp(name);
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
