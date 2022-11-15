'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:down')
	.argument('[name]', 'the migration to undo (defaults to the most recently applied)')
	.description('undo a migration')
	.action(async name => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.migrateDown(name);
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
