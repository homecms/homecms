'use strict';

const {assert} = require('chai');
const {browser, http} = require('../helpers/suite');

describe('pages: /published', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	before(async () => {
		page = await browser.browse('/published');
		response = await http.get('/published');
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

		assert.strictEqual(await browser.getText(title), 'Published Page');
		assert.strictEqual(await browser.getText(heading), 'Published Page');
		assert.strictEqual(await browser.getText(firstParagraph), 'Test published page');
	});

});
