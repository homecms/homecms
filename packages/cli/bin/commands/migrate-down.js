'use strict';

const {Database} = require('@indieweb-cms/database');
const {databaseURL, logger} = require('@indieweb-cms/config');
const {program} = require('commander');

// Program options
program
	.name('indieweb-cms migrate:down')
	.argument('[name]', 'the migration to undo (defaults to the most recently applied)')
	.description('undo a migration')
	.action(async name => {
		try {
			const database = new Database({
				databaseURL,
				logger
			});
			await database.migrateDown(name);
			await database.disconnect();
		} catch (error) {
			logger.error(error);
			process.exit(1);
		}
	})
	.parseAsync(process.argv);
