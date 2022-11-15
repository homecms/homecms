'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms create:migration')
	.argument('<name>', 'the migration name')
	.description('create a database migration')
	.action(async name => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.createMigration(name);
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
