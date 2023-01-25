'use strict';

const {assert} = require('chai');
const {browser, http} = require('../../helpers/suite');

describe('pages: /__admin', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	before(async () => {
		response = await http.get('/__admin');
		page = await browser.browse('/__admin');
	});

	after(async () => {
		await page.close();
	});

	it('responds with the expected HTTP status and headers', async () => {
		assert.isFalse(response.ok);
		assert.strictEqual(response.status, 302);
		assert.strictEqual(response.headers.get('content-type'), 'text/plain; charset=utf-8');
	});

	describe('when logged in', () => {

		it('has tests');

	});

});
