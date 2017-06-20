'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	config = require('../../config/config'),
	Schema = mongoose.Schema;

/**
 * Service Schema
 */
var ServiceSchema = new Schema({
	url: {
		type: String,
		required: 'Please fill Service URL',
		trim: true
	},
	name: {
		type: String,
		required: 'Please fill Service Name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

/*
ServiceSchema.pre('post', function(docs) {
	docs.push({
		url: config.cts2.url,
		name: "Default",
		default: true
	});
});

ServiceSchema.statics.findWithConfigured = function(callback) {
	this.find(function(err, services) {
		services.push({
			url: config.cts2.url,
			name: "Default",
			default: true
		});

		callback(err, services);
	});
};
*/

mongoose.model('Service', ServiceSchema);
