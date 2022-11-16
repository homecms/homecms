'use strict';

// This config is here so that you can run a local
// development instance of the CMS from the root of
// this repo. It is purely used to configure a
// different database URL so we don't accidentally
// override real data in development.

/**
 * @type {import('homecms').Config}
 */
module.exports = {
	databaseURL: process.env.DATABASE_URL || 'postgresql://localhost/homecms-dev'
};
