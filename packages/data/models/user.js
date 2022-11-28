'use strict';

const {Model} = require('../lib/model');

/**
 * The JSON Schema for the model.
 */
const schema = {
	title: 'Page',
	description: 'A page on the website',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			format: 'uuid'
		},
		email: {
			type: 'string',
			minLength: 1,
			maxLength: 255,
			format: 'email'
		},
		dateCreated: {
			type: 'string',
			format: 'date-time' // TODO warning: this is probably wrong
		}
	},
	required: [
		'email'
	]
};

/**
 * Class representing a user model.
 */
exports.UserModel = class UserModel extends Model {

	/**
	 * @protected
	 * @readonly
	 * @type {string}
	 */
	loginTokenTableName = 'userLoginTokens';

	/**
	 * User model constructor.
	 *
	 * @param {import('../lib/model').ModelOptions} options - The model configuration.
	 */
	constructor({dataStore}) {
		super({
			dataStore,
			tableName: 'users',
			schema
		});
	}

	/**
	 * Find a single user by email.
	 *
	 * @param {string} email - The email address.
	 * @returns {Promise<null | Object<string, any>>} - Resolves with the user.
	 */
	async findOneByEmail(email) {
		return await this.findOne({email});
	}

	/**
	 * Find a single user by login token.
	 *
	 * @param {string} tokenId - The login token ID.
	 * @returns {Promise<null | Object<string, any>>} - Resolves with the user.
	 */
	async findOneByLoginToken(tokenId) {
		const token = await this.dataStore.knex(this.loginTokenTableName).first('*')
			.where({id: tokenId})
			.andWhere('expired', '>', new Date());
		if (token) {
			return await this.findOne({id: token.userId});
		}
		return null;
	}

	/**
	 * Create a login token for a user.
	 *
	 * @param {string} userId - The ID of the user to create a login token for.
	 * @returns {Promise<null | Object<string, any>>} - Resolves with a new login token.
	 */
	async createLoginToken(userId) {
		const inserted = await this.dataStore.knex(this.loginTokenTableName).insert({
			userId,
			expired: new Date(Date.now() + (10 * 60 * 1_000)) // 10 minutes
		}, '*');
		return inserted?.[0] || null;
	}

	/**
	 * Delete a login token.
	 *
	 * @param {string} tokenId - The ID of the token to delete.
	 * @returns {Promise<void>} - Resolves when the token is deleted.
	 */
	async deleteLoginToken(tokenId) {
		// TODO task: clear expired tokens on a schedule
		// TODO warning: test that tokens actually expire
		await this.dataStore.knex(this.loginTokenTableName).delete().where({
			id: tokenId
		});
	}

};
