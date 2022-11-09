'use strict';

const {knex} = require('knex');
const LRU = require('lru-cache');
const path = require('node:path');

/**
 * @typedef {object} DatabaseConfig
 * @property {string} databaseURL - The PostgreSQL connection string for the database.
 * @property {import('@indieweb-cms/logger').Logger} logger - The logger to use.
 */

/**
 * Class representing a database.
 */
exports.Database = class Database {

	/**
	 * @type {LRU}
	 */
	cache;

	/**
	 * @type {import('knex').Knex}
	 */
	knex;

	/**
	 * @type {import('@indieweb-cms/logger').Logger}
	 */
	log;

	/**
	 * @private
	 */
	baseMigrationConfig = {
		directory: path.resolve(__dirname, '..', 'migrations'),
		tableName: 'migrations',
		stub: path.resolve(__dirname, 'migration-template.js')
	};

	/**
	 * Database constructor.
	 *
	 * @param {DatabaseConfig} config - The database configuration.
	 */
	constructor({databaseURL, logger}) {
		this.log = logger;

		// Set up an in-memory cache
		this.cache = new LRU({
			max: 1000 // TODO make this configurable
			// TODO also set max size and the calculation
		});

		// Set up a Knex database
		this.knex = knex({
			client: 'pg',
			connection: databaseURL,
			searchPath: ['indieweb-cms', 'public'], // TODO do we need this?
			acquireConnectionTimeout: 30 * 1000, // 30 seconds
			pool: {
				afterCreate: (_, done) => {
					this.log.info({
						event: 'POSTGRES_CONNECTED',
						message: `Database connection pool created`
					});
					done();
				}
			}
		});

		// Send debug logs for queries
		this.knex.on('query', ({sql, bindings}) => {
			this.log.debug({
				event: 'POSTGRES_QUERY',
				message: 'Runing PostgreSQL query',
				sql,
				bindings
			});
		});
	}

	/**
	 * Create a new migration file.
	 *
	 * @param {string} name - The name of the migration.
	 * @returns {Promise<void>} - Resolves when the migration has been created.
	 */
	async createMigration(name) {
		await this.knex.migrate.make(name, this.baseMigrationConfig);
		this.log.info(`Migration ${name} created`);
	}

	/**
	 * Apply all migrations until the database is up-to-date.
	 *
	 * @returns {Promise<void>} - Resolves when the migration is complete.
	 */
	async migrateToLatest() {
		await this.knex.migrate.latest(this.baseMigrationConfig);
		this.log.info('Database migrated to the latest version');
	}

	/**
	 * Apply a single migration.
	 *
	 * @param {string} [name] - The name of the migration to apply. Defaults to the next unapplied.
	 * @returns {Promise<void>} - Resolves when the migration is complete.
	 */
	async migrateUp(name) {
		await this.knex.migrate.up({
			name,
			...this.baseMigrationConfig
		});
		this.log.info(`Database migrated up${name ? ` to ${name}` : ''}`);
	}

	/**
	 * Undo a migration.
	 *
	 * @param {string} [name] - The name of the migration to undo. Defaults to the most recent.
	 * @returns {Promise<void>} - Resolves when the migration is complete.
	 */
	async migrateDown(name) {
		await this.knex.migrate.down({
			name,
			...this.baseMigrationConfig
		});
		this.log.info(`Database migration${name ? ` ${name}` : ''} undone`);
	}

	/**
	 * @returns {Promise<void>} - Resolves when the database is disconnected.
	 */
	async disconnect() {
		await this.knex.destroy();
	}

};
