'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms migrate:up')
	.argument('[name]', 'the migration to apply (defaults to the next unapplied)')
	.description('apply a migration')
	.action(async name => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.migrateUp(name);
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
