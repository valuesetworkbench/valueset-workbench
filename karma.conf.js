'use strict';

/**
 * Module dependencies.
 */
var applicationConfiguration = require('./config/config');

// Karma configuration
module.exports = function(config) {
	// PhantomJS Shim - http://stackoverflow.com/questions/27659514/phantomjs-function-prototype-bind
	var shims = ['public/lib/phantomjs-polyfill/bind-polyfill.js'];

	config.set({
		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: shims.concat(applicationConfiguration.assets.lib.js, applicationConfiguration.assets.js, applicationConfiguration.assets.tests),

		// Test results reporter to use
		// Possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		//reporters: ['progress'],
		reporters: ['progress', 'junit', 'coverage'],

		// Web server port
		port: 9876,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// If true, it capture browsers, run tests and exit
		singleRun: true,
		plugins          : [
			'karma-jasmine',
			'karma-phantomjs-launcher',
			'karma-junit-reporter',
			'karma-coverage',
			'karma-jenkins-reporter'
		],
		// changes type to `cobertura`
		coverageReporter : {
			type : 'cobertura',
			dir  : 'target/coverage-reports/'
		},
		// saves report at `target/surefire-reports/TEST-*.xml` because Jenkins
		// looks for this location and file prefix by default.
		junitReporter    : {
			outputDir : 'target/surefire-reports/'
		}
	});
};