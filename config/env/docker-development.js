'use strict';

module.exports = {
	forceAgreeToTerms: true,
	db: 'mongodb://db/valueset-workbench-dev',

	cts2: {
		url: 'http://cts2:8080/cts2/'
	},
	automap: {
		url: 'http://cts2-automap:8080/'
	},
	databaseExplorer: {
		url: 'http://database-explorer:8080/'
	},
	standardizer: {
		url: 'http://standardizer:8080/'
	},
	valueSetMetrics: {
		url: 'http://valueset-metrics/'
	},
};
