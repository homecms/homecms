'use strict';

const {DataStore} = require('@homecms/data');
const {databaseURL, logger} = require('@homecms/config');
const {program} = require('commander');

// Program options
program
	.name('homecms create:seed')
	.argument('<name>', 'the seed directory name')
	.description('create a database seed data')
	.action(async name => {
		try {
			const dataStore = new DataStore({
				databaseURL,
				logger
			});
			await dataStore.createSeedData(name);
			await dataStore.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
