'use strict';

const {assert} = require('chai');
const {browser, http} = require('../../helpers/suite');

const SELECTORS = {
	PAGE_SUMMARY: '[data-test-id=page-summary]',
	PAGE_SUMMARY_TITLE: '[data-test-id=page-summary__title]',
	PAGE_SUMMARY_PATH: '[data-test-id=page-summary__path]',
	PAGE_SUMMARY_STATUS: '[data-test-id=page-summary__status]'
};

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

		it('has a title', async () => {
			const title = await page.$('html > head > title');
			const main = await page.$('main');
			const heading = await main.$('h1');

			assert.strictEqual(await browser.getText(title), 'Dashboard : Admin');
			assert.strictEqual(await browser.getText(heading), 'Dashboard');
		});

		it('lists all published and draft pages', async () => {
			const summaries = await page.$$(SELECTORS.PAGE_SUMMARY);
			assert.lengthOf(summaries, 4);

			const expectedValues = [
				{
					title: 'Draft Page',
					path: '/draft',
					status: 'draft'
				},
				{
					title: 'Edited Page',
					path: '/edited',
					status: 'published'
				},
				{
					title: 'Home',
					path: '/',
					status: 'published'
				},
				{
					title: 'Published Page',
					path: '/published',
					status: 'published'
				}
			];

			for (const [index, summary] of Object.entries(summaries)) {
				const title = await summary.$(SELECTORS.PAGE_SUMMARY_TITLE);
				const path = await summary.$(SELECTORS.PAGE_SUMMARY_PATH);
				const status = await summary.$(SELECTORS.PAGE_SUMMARY_STATUS);
				assert.strictEqual(await browser.getText(title), expectedValues[index].title);
				assert.strictEqual(await browser.getText(path), expectedValues[index].path);
				assert.strictEqual(await browser.getText(status), expectedValues[index].status);
			}
		});

	});

});
