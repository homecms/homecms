'use strict';

const {assert} = require('chai');
const {browser, http} = require('../helpers/suite');

describe('pages: /', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	before(async () => {
		response = await http.get('/');
		page = await browser.browse('/');
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
		const firstParagraph = await main.$('p');

		assert.strictEqual(await browser.getText(title), 'Home');
		assert.strictEqual(await browser.getText(heading), 'Home');
		assert.strictEqual(await browser.getText(firstParagraph), 'Test home page');
	});
});
