'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms migrate:latest')
	.description('run all migrations which have not yet been run')
	.action(async () => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.migrateToLatest();
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
