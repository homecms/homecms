'use strict';

const {suite} = require('../suite');

/**
 * @returns {import('knex').Knex} - Returns the test Knex instance.
 */
exports.knex = function knex() {
	const {dataStore} = suite();
	return dataStore.knex;
};
