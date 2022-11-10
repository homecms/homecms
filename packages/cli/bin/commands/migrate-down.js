'use strict';

const {DataStore} = require('@indieweb-cms/data');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms migrate:down')
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
