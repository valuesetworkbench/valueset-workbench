'use strict';

var lib = require("./lib");

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/valueset-workbench',
	forceAgreeToTerms: true,
	assets: {
		lib: lib.lib,
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	}
};