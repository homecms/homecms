'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms create:seed')
	.argument('<name>', 'the seed directory name')
	.description('create a database seed data')
	.action(async name => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.createSeedData(name);
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
