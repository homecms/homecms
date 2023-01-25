'use strict';

const {suite} = require('../suite');

/**
 * @param {string} method - The HTTP method to use.
 * @param {string} url - The URL to make a request to.
 * @param {Object<string, string>} [headers] - HTTP headers to send with the request.
 * @returns {Promise<Response>} - Returns the resolved HTTP response.
 */
async function request(method, url, headers) {
	const {baseURL} = suite();
	const requestUrl = new URL(url, baseURL);
	const response = await fetch(requestUrl, {
		redirect: 'manual',
		method,
		headers
	});
	return response;
}

/**
 * @param {string} url - The URL to make a request to.
 * @param {Object<string, string>} [headers] - HTTP headers to send with the request.
 * @returns {Promise<Response>} - Returns the resolved HTTP response.
 */
exports.get = request.bind(null, 'GET');

/**
 * @param {string} url - The URL to make a request to.
 * @param {Object<string, string>} [headers] - HTTP headers to send with the request.
 * @returns {Promise<Response>} - Returns the resolved HTTP response.
 */
exports.post = request.bind(null, 'POST');

/**
 * @param {import('puppeteer').Page} page - The page to extract a cookie header from.
 * @returns {Promise<string>} - Returns the page cookies as a string.
 */
exports.getCookiesFromPage = async function getCookiesFromPage(page) {
	const cookies = await page.cookies();
	return cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
};
