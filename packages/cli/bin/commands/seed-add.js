'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms seed:add')
	.argument('<name>', 'the seed directory name')
	.description('add a directory of seed data to the database')
	.action(async name => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.addSeedData(name);
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
