'use strict';

const {suite} = require('../suite');

/**
 * @param {string} email - The email address of the user to create a token for.
 * @returns {Promise<string | null>} - Returns the created token ID.
 */
exports.createLoginTokenForEmail = async function createLoginTokenForEmail(email) {
	const {dataStore} = suite();
	const user = await dataStore.models.user.findOneByEmail(email);
	if (!user) {
		throw new Error(`User with email ${email} does not exist`);
	}
	const token = await dataStore.models.user.createLoginToken(user?.id);
	if (!token) {
		throw new Error('Could not create a login token');
	}
	return token?.id || null;
};

/**
 * @returns {Promise<void>} - Returns when all logins are purged.
 */
exports.purgeLogins = async function purgeLogins() {
	const {dataStore} = suite();
	await dataStore.knex('userLoginTokens').delete();
	await dataStore.knex('sessions').delete();
};
