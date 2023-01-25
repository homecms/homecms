'use strict';

const {assert} = require('chai');
const {unsign: unsignCookie} = require('cookie-signature');
const {auth, browser, database, http} = require('../../helpers/suite');

const ACCEPTABLE_DATE_DELTA = 5_000; // 5 seconds

const SELECTORS = {
	LOGIN_FORM: '[data-testid=login-form]',
	SUCCESS_ALERT: '[data-testid=login-form__success]',
	EMAIL_FIELD: 'input[name=email]',
	SUBMIT_BUTTON: 'button[type=submit]'
};

describe('pages: /__admin/login', () => {

	/** @type {import('puppeteer').Page} */
	let page;

	/** @type {Response} */
	let response;

	/** @type {import('knex').Knex} */
	let db;

	before(async () => {
		response = await http.get('/__admin/login');
		page = await browser.browse('/__admin/login');
		db = database.knex();
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
		const form = await page.$(SELECTORS.LOGIN_FORM);
		const emailField = await form.$(SELECTORS.EMAIL_FIELD);

		assert.strictEqual(await browser.getAttribute(form, 'action'), null);
		assert.strictEqual(await browser.getAttribute(form, 'method'), 'post');

		assert.strictEqual(await browser.getAttribute(emailField, 'type'), 'email');
	});

	it('does not have a success alert', async () => {
		assert.isNull(await page.$(SELECTORS.SUCCESS_ALERT));
	});

	describe('when the login form is submitted with a valid email address', () => {

		before(async () => {
			await auth.purgeLogins();
			await page.type(SELECTORS.EMAIL_FIELD, 'admin@localhost');
			const navigation = page.waitForNavigation();
			await page.click(SELECTORS.SUBMIT_BUTTON);
			await navigation;
		});

		it('has a success alert message', async () => {
			const alert = await page.$(SELECTORS.SUCCESS_ALERT);
			assert.strictEqual(await browser.getAttribute(alert, 'role'), 'alert');
			assert.include(await browser.getText(alert), 'admin@localhost');
		});

		it('creates a login token in the database pointing to the user who logged in', async () => {
			const tokens = await db.select('*').from('userLoginTokens');
			assert.lengthOf(tokens, 1);

			const {userId, expired} = tokens[0];
			const [user] = await db.select('*').from('users').where({id: userId});
			assert.strictEqual(user.email, 'admin@localhost');

			// Expiry should be 10 minutes in the future, give or take
			const tenMinutesInTheFuture = Date.now() + (10 * 60 * 1_000);
			assert.closeTo(expired.valueOf(), tenMinutesInTheFuture, ACCEPTABLE_DATE_DELTA);
		});

		it('does not create a session', async () => {
			const sessions = await db.select('*').from('sessions');
			assert.lengthOf(sessions, 0);
		});

	});

	describe('when the login form is submitted with an invalid email address', () => {

		before(async () => {
			await auth.purgeLogins();
			await page.type(SELECTORS.EMAIL_FIELD, 'notauser@localhost');
			const navigation = page.waitForNavigation();
			await page.click(SELECTORS.SUBMIT_BUTTON);
			await navigation;
		});

		it('has a success alert message', async () => {
			const alert = await page.$(SELECTORS.SUCCESS_ALERT);
			assert.strictEqual(await browser.getAttribute(alert, 'role'), 'alert');
			assert.include(await browser.getText(alert), 'notauser@localhost');
		});

		it('does not create a login token', async () => {
			const tokens = await db.select('*').from('userLoginTokens');
			assert.lengthOf(tokens, 0);
		});

		it('does not create a session', async () => {
			const sessions = await db.select('*').from('sessions');
			assert.lengthOf(sessions, 0);
		});

	});

	describe('when a valid login token is provided', () => {

		before(async () => {
			await auth.purgeLogins();
			const token = await auth.createLoginTokenForEmail('admin@localhost');
			await page.goto(browser.resolveURL(`/__admin/login?token=${token}`));
		});

		it('redirects to the admin dashboard', async () => {
			assert.strictEqual(page.url(), browser.resolveURL('/__admin'));
		});

		it('deletes the login token', async () => {
			const tokens = await db.select('*').from('userLoginTokens');
			assert.lengthOf(tokens, 0);
		});

		it('creates a session and corresponding signed cookie', async () => {
			const sessions = await db.select('*').from('sessions');
			const cookies = await page.cookies();
			assert.lengthOf(sessions, 1);
			assert.lengthOf(cookies, 1);

			const [session] = sessions;
			const [cookie] = cookies;

			assert.isString(session.sess.userId);
			const [user] = await db.select('*').from('users').where({id: session.sess.userId});
			assert.strictEqual(user.email, 'admin@localhost');

			assert.strictEqual(cookie.name, 'HomeCMS.session');
			const cookieValue = decodeURIComponent(cookie.value).replace(/^s:/, '');
			assert.strictEqual(unsignCookie(cookieValue, 'mock-secret'), session.id);
		});

	});

	describe('when an invalid login token is provided', () => {

		before(async () => {
			await auth.purgeLogins();
			await page.goto(browser.resolveURL('/__admin/login?token=invalid-token'));
		});

		it('does not redirect', async () => {
			assert.strictEqual(page.url(), browser.resolveURL('/__admin/login?token=invalid-token'));
		});

		it('does not create a session', async () => {
			const sessions = await db.select('*').from('sessions');
			assert.lengthOf(sessions, 0);
		});

	});

	describe('when logged in', () => {

		it('has tests');

	});

});
