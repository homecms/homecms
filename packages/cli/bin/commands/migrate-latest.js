'use strict';

const {DataStore} = require('@indieweb-cms/data');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms migrate:latest')
	.description('run all migrations which have not yet been run')
	.action(async () => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.migrateToLatest();
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
