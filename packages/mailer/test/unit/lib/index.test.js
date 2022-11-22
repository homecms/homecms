'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('@homecms/mailer', () => {
	let createMailer;
	let nodemailer;

	beforeEach(() => {

		td.replace('nodemailer', {
			createTransport: td.func()
		});
		nodemailer = require('nodemailer');
		td.when(nodemailer.createTransport(), {ignoreExtraArgs: true}).thenReturn('mock-transport');

		createMailer = require('@homecms/mailer/lib').createMailer;
	});

	describe('.createMailer(options)', () => {
		let mailer;

		beforeEach(() => {
			mailer = createMailer({
				emailConnectionURL: 'mock-connection-url',
				emailFromAddress: 'mock-email-address'
			});
		});

		it('creates a nodemailer transport', () => {
			td.verify(nodemailer.createTransport('mock-connection-url', {
				from: 'mock-email-address'
			}), {times: 1});
		});

		it('returns the transport', () => {
			assert.strictEqual(mailer, 'mock-transport');
		});

		describe('when `options.emailConnectionURL` is `false`', () => {

			beforeEach(() => {
				mailer = createMailer({
					emailConnectionURL: false,
					emailFromAddress: 'mock-email-address'
				});
			});

			it('creates a nodemailer transport using sendmail', () => {
				td.verify(nodemailer.createTransport({
					sendmail: true,
					args: ['-f', 'mock-email-address']
				}), {times: 1});
			});

			it('returns the transport', () => {
				assert.strictEqual(mailer, 'mock-transport');
			});

		});

	});

});
