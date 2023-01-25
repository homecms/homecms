/* eslint-disable require-atomic-updates */
'use strict';

const {start, stop} = require('./helpers/suite');

// Set up the test application and run migrations
before(async () => {
	await start();
});

// Tear down the test server and database
after(async () => {
	await stop();
});
