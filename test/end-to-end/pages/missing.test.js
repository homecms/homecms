'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /missing', () => {
	const startUrl = '/missing';

	test.beforeEach(async ({page}) => {
		await page.goto(startUrl);
	});

	test('it responds with the expected HTTP status and headers', async ({request}) => {
		const response = await request.get(startUrl);
		expect(response.ok()).toBeFalsy();
		expect(response.status()).toStrictEqual(404);
		expect(response.headers()).toHaveProperty('content-type', 'text/html; charset=utf-8');
	});

});
