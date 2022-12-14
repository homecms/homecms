#!/usr/bin/env node
'use strict';

const manifest = require('../package.json');
const {program} = require('commander');

program
	.version(manifest.version)
	.command('start', 'run the server', {
		executableFile: 'commands/start'
	})
	.command('create:migration', 'create a database migration', {
		executableFile: 'commands/create-migration'
	})
	.command('migrate:latest', 'run all migrations which have not yet been run', {
		executableFile: 'commands/migrate-latest'
	})
	.command('migrate:up', 'apply a migration', {
		executableFile: 'commands/migrate-up'
	})
	.command('migrate:down', 'undo a migration', {
		executableFile: 'commands/migrate-down'
	})
	.command('create:seed', 'create a database seed data', {
		executableFile: 'commands/create-seed'
	})
	.command('seed:add', 'add a directory of seed data to the database', {
		executableFile: 'commands/seed-add'
	})
	.parse(process.argv);
