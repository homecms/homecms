'use strict';

const {assert} = require('chai');
const {browser, http} = require('../helpers/suite');

describe('pages: /unpublished', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	before(async () => {
		response = await http.get('/unpublished');
		page = await browser.browse('/unpublished');
	});

	after(async () => {
		await page.close();
	});

	it('responds with the expected HTTP status and headers', async () => {
		assert.isFalse(response.ok);
		assert.strictEqual(response.status, 410);
		assert.strictEqual(response.headers.get('content-type'), 'text/html; charset=utf-8');
	});

	it('has a title and expected content', async () => {
		const title = await page.$('html > head > title');
		const main = await page.$('main');
		const heading = await main.$('h1');

		assert.strictEqual(await browser.getText(title), 'Error 410: Gone');
		assert.strictEqual(await browser.getText(heading), 'Error 410');
	});

});
