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
	port: process.env.PORT ? Number(process.env.PORT) : 3456
};
