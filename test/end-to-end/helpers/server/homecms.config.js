'use strict';

// This config is here in order to configure the
// end-to-end tests. It sets a different port as
// well as a different default database URL so
// that there aren't conflicts with the dev server

/**
 * @type {import('homecms').Config}
 */
module.exports = {
	databaseURL: process.env.DATABASE_URL || 'postgresql://localhost/homecms-test',
	logLevel: process.env.LOG_LEVEL || 'fatal',
	port: process.env.PORT ? Number(process.env.PORT) : undefined,

	// It's important that this stays the same - the cookies used in the tests
	// rely on this being the encryption key
	sessionSecret: 'mock-secret'
};
