'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms create:migration')
	.argument('<name>', 'the migration name')
	.description('create a database migration')
	.action(async name => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.createMigration(name);
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
