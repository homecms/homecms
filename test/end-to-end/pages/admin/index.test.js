'use strict';

const {assert} = require('chai');
const {browser, http} = require('../../helpers/suite');

describe('pages: /__admin', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	describe('unauthenticated', () => {

		before(async () => {
			response = await http.get('/__admin');
		});

		it('responds with the expected HTTP status and headers', async () => {
			assert.isFalse(response.ok);
			assert.strictEqual(response.status, 302);
			assert.strictEqual(response.headers.get('content-type'), 'text/plain; charset=utf-8');
		});

	});

	describe('authenticated', () => {

		before(async () => {
			page = await browser.browse('/__admin', 'admin@localhost');
			response = await http.get('/__admin', {
				cookie: await http.getCookiesFromPage(page)
			});
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

			assert.strictEqual(await browser.getText(title), 'Dashboard : Admin');
			assert.strictEqual(await browser.getText(heading), 'Dashboard');
		});

	});

});
