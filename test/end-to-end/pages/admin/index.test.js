'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /__admin', () => {
	const startUrl = '/__admin';

	test.beforeEach(async ({page}) => {
		await page.goto(startUrl);
	});

	test('it responds with the expected HTTP status and headers', async ({request}) => {
		const response = await request.get(startUrl);
		expect(response.ok()).toBeFalsy();
		expect(response.status()).toStrictEqual(401);
		expect(response.headers()).toHaveProperty('content-type', 'text/html; charset=utf-8');
	});

	test('has a title and expected content', async ({page}) => {
		await expect(page).toHaveTitle('Error 401: Unauthorized');

		const main = page.getByRole('main');
		const heading = main.getByRole('heading');

		await expect(heading).toHaveText('Error 401');
	});

});
