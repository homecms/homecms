'use strict';

const {assert} = require('chai');
const {browser, http} = require('../../helpers/suite');

describe('pages: /__admin/login', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	before(async () => {
		response = await http.get('/__admin/login');
		page = await browser.browse('/__admin/login');
	});

	after(async () => {
		await page.close();
	});

	it('responds with the expected HTTP status and headers', async () => {
		assert.isTrue(response.ok);
		assert.strictEqual(response.status, 200);
		assert.strictEqual(response.headers.get('content-type'), 'text/html; charset=utf-8');
	});

	it('has a title and expected content', async () => {
		const title = await page.$('html > head > title');
		const main = await page.$('main');
		const heading = await main.$('h1');

		assert.strictEqual(await browser.getText(title), 'Login : Admin');
		assert.strictEqual(await browser.getText(heading), 'Login');
	});

	it('has a login form', async () => {
		const form = await page.$('[data-testid=login-form]');
		const emailField = await form.$('input[name=email]');

		assert.strictEqual(await browser.getAttribute(form, 'action'), null);
		assert.strictEqual(await browser.getAttribute(form, 'method'), 'post');

		assert.strictEqual(await browser.getAttribute(emailField, 'type'), 'email');
	});

	describe('when the login form is submitted', () => {

		it('has tests');

	});

	describe('when logged in', () => {

		it('has tests');

	});

});
