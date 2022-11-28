'use strict';

const {test, expect} = require('@playwright/test');

test.describe('pages: /__admin/login', () => {
	const startUrl = '/__admin/login';

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
		await expect(page).toHaveTitle('Login : Admin');

		const main = page.getByRole('main');
		const heading = main.getByRole('heading');
		await expect(heading).toHaveText('Login');
	});

	test('has a login form', async ({page}) => {
		const form = page.getByTestId('login-form');
		expect(await form.getAttribute('action')).toBeNull();
		await expect(form).toHaveAttribute('method', 'post');
	});

});
