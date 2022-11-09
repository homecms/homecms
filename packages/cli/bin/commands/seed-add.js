'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms seed:add')
	.argument('<name>', 'the seed directory name')
	.description('add a directory of seed data to the database')
	.action(async name => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.addSeedData(name);
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
