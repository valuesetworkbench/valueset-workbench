'use strict';

var lib = require("./lib"),
	os = require("os");

module.exports = {
	termsOfUseFile: process.env.TERMS_OF_USE_FILE || 'config/terms.txt',
	privacyPolicyFile: process.env.PRIVACY_POLICY_FILE || 'config/privacy.txt',
	admin: {
		password: process.env.ADMIN_PASSWORD || 'admin',
		email: process.env.ADMIN_EMAIL || 'admin@localhost.org'
	},
	app: {
		title: 'Value Set Workbench',
		description: 'Value Set Workbench',
		keywords: 'CTS2'
	},
	resourceUriBase: "http://terms.mayo.edu/",
    cts2: {
		url: process.env.CTS2_URL || 'http://localhost:8080/'
    },
	automap: {
		url: process.env.AUTOMAP_URL || 'http://localhost:8181/'
	},
	databaseExplorer: {
		url: process.env.DATABASE_EXPLORER_URL || 'http://localhost:8182/'
	},
	standardizer: {
		url: process.env.STANDARDIZER_URL || 'http://localhost:8183/'
	},
	valueSetMetrics: {
		url: process.env.VALUESET_METRICS_URL || 'http://localhost:8184/'
	},
	facebook: {
		enabled: process.env.FACEBOOK_ENABLED || false,
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
        enabled: process.env.TWITTER_ENABLED || false,
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
        enabled: process.env.GOOGLE_ENABLED || false,
		clientID: process.env.GOOGLE_ID || 'xxxx',
		clientSecret: process.env.GOOGLE_SECRET || 'xxxx',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
        enabled: process.env.LINKEDIN_ENABLED || false,
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
        enabled: process.env.GITHUB_ENABLED || false,
		clientID: process.env.GITHUB_ID || 'xxxx',
		clientSecret: process.env.GITHUB_SECRET || 'xxxx',
		callbackURL: '/auth/github/callback'
	},
	email: {
		enabled: process.env.EMAIL_ENABLED || false,
		returnAddress: process.env.EMAIL_RETURN_ADDRESS,
		smtp: {
			host: process.env.EMAIL_SMTP_HOST,
			ssl: process.env.EMAIL_SMTP_SSL
		}
	},
	port: process.env.PORT || 3000,
	externalUrl: (process.env.EXTERNAL_URL || "http://" + os.hostname() + ":" + (process.env.PORT || 3000)),
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: lib.lib,
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
