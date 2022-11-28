'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /unpublished', () => {
	const startUrl = '/unpublished';

	test.beforeEach(async ({page}) => {
		await page.goto(startUrl);
	});

	test('it responds with the expected HTTP status and headers', async ({request}) => {
		const response = await request.get(startUrl);
		expect(response.ok()).toBeFalsy();
		expect(response.status()).toStrictEqual(410);
		expect(response.headers()).toHaveProperty('content-type', 'text/html; charset=utf-8');
	});

	test('has a title and expected content', async ({page}) => {
		await expect(page).toHaveTitle('Error 410: Gone');

		const main = page.getByRole('main');
		const heading = main.getByRole('heading');

		await expect(heading).toHaveText('Error 410');
	});

});
