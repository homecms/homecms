'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /', () => {
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

	test('has a title and expected content', async ({page}) => {
		await expect(page).toHaveTitle('Home');

		const main = page.getByRole('main');
		const heading = main.getByRole('heading');
		const paragraph = main.getByRole('paragraph');

		await expect(heading).toHaveText('Home');
		await expect(paragraph).toHaveText('Test home page');
	});

});
