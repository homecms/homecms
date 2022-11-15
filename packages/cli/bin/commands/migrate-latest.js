'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms migrate:latest')
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
