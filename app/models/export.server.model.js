'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Export Schema
 */
var ExportSchema = new Schema({
    valuesetId: {
		type: String,
		required: true
	},
    location: {
        type: String,
        required: true
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

mongoose.model('Export', ExportSchema);