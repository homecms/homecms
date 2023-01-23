'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /__admin', () => {
	const startUrl = '/__admin';

	test.beforeEach(async ({page}) => {
		await page.goto(startUrl);
	});

	test('it responds with the expected HTTP status and headers', async ({request}) => {
		const response = await request.get(startUrl, {
			maxRedirects: 0
		});
		expect(response.ok()).toBeFalsy();
		expect(response.status()).toStrictEqual(302);
		expect(response.headers()).toHaveProperty('content-type', 'text/plain; charset=utf-8');
		expect(response.headers()).toHaveProperty('location', '/__admin/login');
	});

});
