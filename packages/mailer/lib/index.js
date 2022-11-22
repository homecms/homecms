'use strict';

const nodemailer = require('nodemailer');

/**
 * @typedef {nodemailer.Transporter} Mailer
 */

/**
 * @typedef {object} MailerConfig
 * @property {string | false} emailConnectionURL - Email connection details. A value of `false` indicates to use the `sendmail` command.
 * @property {string} emailFromAddress - The email address system emails will be sent from.
 */

/**
 * Create a mailer.
 *
 * @param {MailerConfig} config - Mailer configuration options.
 * @returns {Mailer} - Returns the created nodemailer transport.
 */
exports.createMailer = function createMailer({emailConnectionURL, emailFromAddress}) {
	if (emailConnectionURL === false) {
		return nodemailer.createTransport({
			sendmail: true,
			args: ['-f', emailFromAddress]
		});
	}
	return nodemailer.createTransport(emailConnectionURL, {
		from: emailFromAddress
	});
};
