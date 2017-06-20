'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Connection Schema
 */
var ConnectionSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Connection name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	jdbcUrl: {
		type: String,
		required: 'Please fill JDBC URL',
	}
});

mongoose.model('Connection', ConnectionSchema);