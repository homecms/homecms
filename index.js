'use strict';

const config = require('@indieweb-cms/config');
const createServer = require('@indieweb-cms/server');

// Create the server
const server = createServer(config);

// Start the server
(async () => {
	try {
		await server.listen({
			port: config.port
		});
	} catch (error) {
		server.log.error(error);
		process.exit(1);
	}
})();
