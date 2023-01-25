'use strict';

const {assert} = require('chai');
const {suite} = require('../suite');

/**
 * @param {string} url - The URL to resolve.
 * @returns {string} - Returns the URL resolved against the test suite base URL.
 */
exports.resolveURL = function resolveURL(url) {
	const {baseURL} = suite();
	return new URL(url, baseURL).toString();
};

/**
 * @param {string} url - The URL to open a browser with.
 * @returns {Promise<import('puppeteer').Page>} - Returns the opened Puppeteer page.
 */
exports.browse = async function browse(url) {
	const {browser} = suite();
	const page = await browser.newPage();
	await page.goto(exports.resolveURL(url));
	return page;
};

/**
 * @param {import('puppeteer').ElementHandle} element - The element to get the text content of.
 * @param {boolean} [trim] - Whether to trim whitespace before returning the text.
 * @returns {Promise<string>} - Returns the element text content.
 */
exports.getText = async function getText(element, trim = true) {
	assert.isNotNull(element, 'Element was not found');
	const textContent = await element.evaluate(el => el.textContent || '');
	return trim ? textContent.trim() : textContent;
};

/**
 * @param {import('puppeteer').ElementHandle} element - The element to get the attribute of.
 * @param {string} attribute - The attribute to get the value of.
 * @returns {Promise<string | null>} - Returns the attribute text or null if the attribute is not set.
 */
exports.getAttribute = async function getAttribute(element, attribute) {
	assert.isNotNull(element, 'Element was not found');
	return await element.evaluate((el, attr) => {
		return el.getAttribute(attr);
	}, attribute);
};
