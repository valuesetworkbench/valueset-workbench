'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Group name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	logo: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	owner: {
		type: Schema.ObjectId,
		ref: 'User',
		required: 'Every Group needs an Owner',
	},
	members: [{
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		},
		permissions: [{type: String}]
	}]
});

GroupSchema.statics.permissions = ['Create', 'Edit', "Delete"];

mongoose.model('Group', GroupSchema);