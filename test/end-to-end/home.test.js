'use strict';

const {test, expect} = require('@playwright/test');

test.describe('home', () => {
	const startUrl = '/';

	test.beforeEach(async ({page}) => {
		await page.goto(startUrl);
	});

	test('it responds with the expected HTTP status and headers', async ({request}) => {
		const response = await request.get(startUrl);
		expect(response.ok()).toBeTruthy();
		expect(response.status()).toStrictEqual(200);
		expect(response.headers()).toHaveProperty('content-type', 'text/html; charset=utf-8');
	});

	test('has a title', async ({page}) => {
		await expect(page).toHaveTitle(/Hello/);
	});

});
