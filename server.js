'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	fs = require('fs'),
	config = require('./config/config'),
	https = require('https'),
	mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error('\x1b[31m', 'Could not connect to MongoDB!');
		console.log(err);
	}
});

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
//server.listen(config.port);

app.listen(config.port);

//disable this for now
//app.disable('etag');

// Expose app
exports = module.exports = app;

process.on('uncaughtException', function(err){
	console.error('UncaughtException: ' + err.message);
	console.error(err.stack);
});

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);